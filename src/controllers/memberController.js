const memberRepository = require('../repositories/memberRepository');
const baseResponse = require('../utils/baseResponse');

exports.getMembers = async (req, res) => {
    try {
      const { page, limit, offset } = baseResponse.getPaginationParams(req.query);
      const search = req.query.search?.trim();
      const filters = {
        expression: req.query.filters?.trim(),
      };

      const result = await memberRepository.getAllMembers({ limit, offset, search, filters });
      const meta = baseResponse.buildPaginationMeta({
        count: result.count,
        page,
        limit,
      });
  
      return res.status(200).json(baseResponse.success({
        message: 'Members fetched successfully',
        data: result.rows,
        meta,
      }));
    } catch (error) {
      return res.status(500).json(baseResponse.error({
        message: 'Failed to fetch members',
        errors: error.message,
      }));
    }
};

exports.createMember = async (req, res) => {
  try {
    const { code, name } = req.body;
    const result = await memberRepository.createMember({ code, name });
    return res.status(200).json(baseResponse.success({
      message: 'Member created successfully',
      data: result,
    }));
  } catch (error) {
    return res.status(500).json(baseResponse.error({
      message: 'Failed to create member',
      errors: error.message,
    }));
  }
};

exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name } = req.body;
    const result = await memberRepository.updateMember({ id, code, name });
    return res.status(200).json(baseResponse.success({
      message: 'Member updated successfully',
      data: result,
    }));
  } catch (error) {
    return res.status(500).json(baseResponse.error({
      message: 'Failed to update member',
      errors: error.message,
    }));
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await memberRepository.deleteMember({ id });
    return res.status(200).json(baseResponse.success({
      message: 'Member deleted successfully',
      data: result,
    }));
  } catch (error) {
    if (error.message === 'Member not found') {
      return res.status(404).json(baseResponse.error({
        message: 'Failed to delete member',
        errors: error.message,
      }));
    }

    if (error.message === 'Member cannot be deleted because it has borrowing history') {
      return res.status(400).json(baseResponse.error({
        message: 'Failed to delete member',
        errors: error.message,
      }));
    }

    return res.status(500).json(baseResponse.error({
      message: 'Failed to delete member',
      errors: error.message,
    }));
  }
};