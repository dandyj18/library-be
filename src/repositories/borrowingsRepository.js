'use strict';

const { Op } = require('sequelize');
const { Borrowings, Member, Book, sequelize } = require('../models');
const { parseFilterExpression } = require('../utils/filterExpression');

const BORROWING_FILTER_CONFIG = {
  id: { type: 'number' },
  member_id: { type: 'number' },
  book_id: { type: 'number' },
  borrow_date: { type: 'string' },
  return_date: { type: 'string' },
  due_date: { type: 'string' },
  member_name: { path: '$member.name$', type: 'string' },
  member_code: { path: '$member.code$', type: 'string' },
  book_title: { path: '$book.title$', type: 'string' },
  book_code: { path: '$book.code$', type: 'string' },
};

const borrowingInclude = [
  {
    model: Member,
    as: 'member',
    attributes: ['id', 'code', 'name'],
  },
  {
    model: Book,
    as: 'book',
    attributes: ['id', 'code', 'title'],
  },
];

const getAllBorrowings = async ({ limit, offset, search, filters = {} }) => {
  const include = borrowingInclude.map((item) => ({ ...item }));
  const conditions = [];

  if (search) {
    include[0].where = {
      [Op.or]: [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
      ],
    };
    include[0].required = false;

    include[1].where = {
      [Op.or]: [
        { code: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
      ],
    };
    include[1].required = false;
  }

  if (search) {
    conditions.push({
      [Op.or]: [
        { '$member.code$': { [Op.iLike]: `%${search}%` } },
        { '$member.name$': { [Op.iLike]: `%${search}%` } },
        { '$book.code$': { [Op.iLike]: `%${search}%` } },
        { '$book.title$': { [Op.iLike]: `%${search}%` } },
      ],
    });
  }

  const expressionConditions = parseFilterExpression(filters.expression, BORROWING_FILTER_CONFIG);
  if (expressionConditions.length > 0) {
    conditions.push(...expressionConditions);
  }

  const where = conditions.length > 0 ? { [Op.and]: conditions } : {};

  return Borrowings.findAndCountAll({
    limit,
    offset,
    order: [['id', 'ASC']],
    include,
    where,
    subQuery: false,
  });
};

const createBorrowing = async ({
  member_id,
  book_id,
  borrow_date,
  return_date,
  due_date,
}) => {
  return sequelize.transaction(async (transaction) => {
    if (!return_date) {
      const book = await Book.findByPk(book_id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!book) {
        throw new Error('Book not found');
      }

      await book.decrement('stock', { by: 1, transaction });
    }

    const borrowing = await Borrowings.create(
      {
        member_id,
        book_id,
        borrow_date,
        return_date,
        due_date,
      },
      { transaction }
    );

    return Borrowings.findByPk(borrowing.id, {
      include: borrowingInclude,
      transaction,
    });
  });
};

const updateBorrowing = async ({
  id,
  member_id,
  book_id,
  borrow_date,
  return_date,
  due_date,
}) => {
  return sequelize.transaction(async (transaction) => {
    const existingBorrowing = await Borrowings.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!existingBorrowing) {
      throw new Error('Borrowing not found');
    }

    const oldConsumed = !existingBorrowing.return_date;
    const newConsumed = !return_date;
    const oldBookId = existingBorrowing.book_id;
    const newBookId = book_id;

    const stockDeltaByBook = new Map();

    if (oldConsumed) {
      stockDeltaByBook.set(oldBookId, (stockDeltaByBook.get(oldBookId) || 0) + 1);
    }

    if (newConsumed) {
      stockDeltaByBook.set(newBookId, (stockDeltaByBook.get(newBookId) || 0) - 1);
    }

    const uniqueBookIds = [...stockDeltaByBook.keys()];
    if (uniqueBookIds.length > 0) {
      const books = await Book.findAll({
        where: { id: uniqueBookIds },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      const booksMap = new Map(books.map((book) => [book.id, book]));

      for (const [bookId, delta] of stockDeltaByBook.entries()) {
        if (delta === 0) continue;
        const book = booksMap.get(bookId);

        if (!book) {
          throw new Error(`Book ${bookId} not found`);
        }

        const nextStock = book.stock + delta;
        book.stock = nextStock;
        await book.save({ transaction });
      }
    }

    await Borrowings.update(
      { member_id, book_id, borrow_date, return_date, due_date },
      { where: { id }, transaction }
    );

    return Borrowings.findByPk(id, { include: borrowingInclude, transaction });
  });
};

const deleteBorrowing = async ({ id }) => {
  return sequelize.transaction(async (transaction) => {
    const existingBorrowing = await Borrowings.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!existingBorrowing) {
      throw new Error('Borrowing not found');
    }

    // If the borrowing is still active, return stock back to the book.
    if (!existingBorrowing.return_date) {
      const book = await Book.findByPk(existingBorrowing.book_id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!book) {
        throw new Error('Book not found');
      }

      await book.increment('stock', { by: 1, transaction });
    }

    await Borrowings.destroy({ where: { id }, transaction });
    return { deleted: true };
  });
};

module.exports = {
  getAllBorrowings,
  createBorrowing,
  updateBorrowing,
  deleteBorrowing,
};
