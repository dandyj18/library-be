const borrowingsRepository = require('../repositories/borrowingsRepository');
const baseResponse = require('../utils/baseResponse');

exports.getBorrowings = async (req, res) => {
    try {
      const { page, limit, offset } = baseResponse.getPaginationParams(req.query);
      const search = req.query.search?.trim();
      const filters = {
        expression: req.query.filters?.trim(),
      };

      const result = await borrowingsRepository.getAllBorrowings({ limit, offset, search, filters });
      const meta = baseResponse.buildPaginationMeta({
        count: result.count,
        page,
        limit,
      });
  
      return res.status(200).json(baseResponse.success({
        message: 'Borrowings fetched successfully',
        data: result.rows,
        meta,
      }));
    } catch (error) {
      return res.status(500).json(baseResponse.error({
        message: 'Failed to fetch borrowings',
        errors: error.message,
      }));
    }
};

exports.createBorrowing = async (req, res) => {
  try {
    const { member_id, book_id, borrow_date, return_date, due_date } = req.body;
    const result = await borrowingsRepository.createBorrowing({
      member_id,
      book_id,
      borrow_date,
      return_date,
      due_date,
    });
    return res.status(200).json(baseResponse.success({
      message: 'Borrowing created successfully',
      data: result,
    }));
  } catch (error) {
    return res.status(500).json(baseResponse.error({
      message: 'Failed to create borrowing',
      errors: error.message,
    }));
  }
};

exports.updateBorrowing = async (req, res) => {
  try {
    const { id } = req.params;
    const { member_id, book_id, borrow_date, return_date, due_date } = req.body;
    const result = await borrowingsRepository.updateBorrowing({
      id,
      member_id,
      book_id,
      borrow_date,
      return_date,
      due_date,
    });
    return res.status(200).json(baseResponse.success({
      message: 'Borrowing updated successfully',
      data: result,
    }));
  } catch (error) {
    return res.status(500).json(baseResponse.error({
      message: 'Failed to update borrowing',
      errors: error.message,
    }));
  }
};

exports.deleteBorrowing = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await borrowingsRepository.deleteBorrowing({ id });
    return res.status(200).json(baseResponse.success({
      message: 'Borrowing deleted successfully',
      data: result,
    }));
  } catch (error) {
    if (error.message === 'Borrowing not found') {
      return res.status(404).json(baseResponse.error({
        message: 'Failed to delete borrowing',
        errors: error.message,
      }));
    }

    if (error.message === 'Book not found') {
      return res.status(404).json(baseResponse.error({
        message: 'Failed to delete borrowing',
        errors: error.message,
      }));
    }

    return res.status(500).json(baseResponse.error({
      message: 'Failed to delete borrowing',
      errors: error.message,
    }));
  }
};