'use strict';

const { Op } = require('sequelize');
const { Member, Borrowings } = require('../models');
const { parseFilterExpression } = require('../utils/filterExpression');

const MEMBER_FILTER_CONFIG = {
  id: { type: 'number' },
  code: { type: 'string' },
  name: { type: 'string' },
};

const getAllMembers = async ({ limit, offset, search, filters = {} }) => {
  const conditions = [];

  if (search) {
    conditions.push({
      [Op.or]: [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
      ],
    });
  }

  const expressionConditions = parseFilterExpression(filters.expression, MEMBER_FILTER_CONFIG);
  if (expressionConditions.length > 0) {
    conditions.push(...expressionConditions);
  }

  const where = conditions.length > 0 ? { [Op.and]: conditions } : {};

  return Member.findAndCountAll({
    limit,
    offset,
    order: [['id', 'ASC']],
    where,
  });
};

const createMember = async ({ code, name }) => {
  return Member.create({ code, name });
};

const updateMember = async ({ id, code, name }) => {
  await Member.update(
    { code, name },
    { where: { id } }
  );

  return Member.findByPk(id);
};

const deleteMember = async ({ id }) => {
  const existingMember = await Member.findByPk(id);
  if (!existingMember) {
    throw new Error('Member not found');
  }

  const borrowingCount = await Borrowings.count({ where: { member_id: id } });
  if (borrowingCount > 0) {
    throw new Error('Member cannot be deleted because it has borrowing history');
  }

  await Member.destroy({ where: { id } });
  return { deleted: true };
};

module.exports = {
  getAllMembers,
  createMember,
  updateMember,
  deleteMember,
};
