const booksRepository = require('../repositories/booksRepository');
const baseResponse = require('../utils/baseResponse');

exports.getBooks = async (req, res) => {
  try {
    const { page, limit, offset } = baseResponse.getPaginationParams(req.query);
    const search = req.query.search?.trim();
    const filters = {
      expression: req.query.filters?.trim(),
    };

    const result = await booksRepository.getAllBooks({ limit, offset, search, filters });
    const meta = baseResponse.buildPaginationMeta({
      count: result.count,
      page,
      limit,
    });

    return res.status(200).json(baseResponse.success({
      message: 'Books fetched successfully',
      data: result.rows,
      meta,
    }));
  } catch (error) {
    return res.status(500).json(baseResponse.error({
      message: 'Failed to fetch books',
      errors: error.message,
    }));
  }
};

exports.createBook = async (req, res) => {
  try {
    const { code, title, author, stock } = req.body;
    const result = await booksRepository.createBook({ code, title, author, stock });
    return res.status(200).json(baseResponse.success({
      message: 'Book created successfully',
      data: result,
    }));
  } catch (error) {
    return res.status(500).json(baseResponse.error({
      message: 'Failed to create book',
      errors: error.message,
    }));
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, title, author, stock } = req.body;
    const result = await booksRepository.updateBook({ id, code, title, author, stock });
    return res.status(200).json(baseResponse.success({
      message: 'Book updated successfully',
      data: result,
    }));
  } catch (error) {
    return res.status(500).json(baseResponse.error({
      message: 'Failed to update book',
      errors: error.message,
    }));
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await booksRepository.deleteBook(id);
    return res.status(200).json(baseResponse.success({
      message: 'Book deleted successfully',
      data: result,
    }));
  } catch (error) {
    if (error.message === 'Book not found') {
      return res.status(404).json(baseResponse.error({
        message: 'Failed to delete book',
        errors: error.message,
      }));
    }

    if (error.message === 'Book cannot be deleted because it has borrowing history') {
      return res.status(400).json(baseResponse.error({
        message: 'Failed to delete book',
        errors: error.message,
      }));
    }

    return res.status(500).json(baseResponse.error({
      message: 'Failed to delete book',
      errors: error.message,
    }));
  }
};