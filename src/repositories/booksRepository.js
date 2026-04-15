'use strict';

const { Op } = require('sequelize');
const { Book, Borrowings } = require('../models');
const { parseFilterExpression } = require('../utils/filterExpression');

const BOOK_FILTER_CONFIG = {
  id: { type: 'number' },
  code: { type: 'string' },
  title: { type: 'string' },
  author: { type: 'string' },
  stock: { type: 'number' },
};

const getAllBooks = async ({ limit, offset, search, filters = {} }) => {
  const conditions = [];

  if (search) {
    conditions.push({
      [Op.or]: [
        { code: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
        { author: { [Op.iLike]: `%${search}%` } },
      ],
    });
  }

  const expressionConditions = parseFilterExpression(filters.expression, BOOK_FILTER_CONFIG);
  if (expressionConditions.length > 0) {
    conditions.push(...expressionConditions);
  }

  const where = conditions.length > 0 ? { [Op.and]: conditions } : {};

  return Book.findAndCountAll({
    limit,
    offset,
    order: [['id', 'ASC']],
    where,
  });
};

const createBook = async ({ code, title, author, stock }) => {
  return Book.create({ code, title, author, stock });
};

const updateBook = async ({ id, code, title, author, stock }) => {
  await Book.update(
    { code, title, author, stock },
    { where: { id } }
  );

  return Book.findByPk(id);
};

const deleteBook = async (id) => {
  const existingBook = await Book.findByPk(id);
  if (!existingBook) {
    throw new Error('Book not found');
  }

  const borrowingCount = await Borrowings.count({ where: { book_id: id } });
  if (borrowingCount > 0) {
    throw new Error('Book cannot be deleted because it has borrowing history');
  }

  await Book.destroy({ where: { id } });
  return { deleted: true };
};

module.exports = {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
};
