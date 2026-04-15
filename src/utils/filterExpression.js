'use strict';

const { Op } = require('sequelize');

const parseValue = (value, type) => {
  if (type === 'number') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return value;
};

const parseFilterExpression = (expression, fieldConfig = {}) => {
  if (!expression) return [];

  const parts = expression
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.reduce((acc, part) => {
    const match = part.match(
      /^([a-zA-Z_][a-zA-Z0-9_.]*)\s*(=|!=|>=|<=|>|<|~|like|ilike)\s*(.+)$/i
    );
    if (!match) return acc;

    const [, rawField, rawOperator, rawValue] = match;
    const fieldKey = rawField.trim();
    const config = fieldConfig[fieldKey];
    if (!config) return acc;

    const operator = rawOperator.toLowerCase();
    const cleaned = rawValue.trim().replace(/^['"]|['"]$/g, '');
    const value = parseValue(cleaned, config.type || 'string');
    if (value === null) return acc;

    const path = config.path || fieldKey;
    const operatorMap = {
      '=': Op.eq,
      '!=': Op.ne,
      '>': Op.gt,
      '>=': Op.gte,
      '<': Op.lt,
      '<=': Op.lte,
      '~': Op.iLike,
      like: Op.like,
      ilike: Op.iLike,
    };

    const mappedOperator = operatorMap[operator];
    if (!mappedOperator) return acc;

    if (operator === '~' || operator === 'like' || operator === 'ilike') {
      acc.push({ [path]: { [mappedOperator]: `%${value}%` } });
    } else {
      acc.push({ [path]: { [mappedOperator]: value } });
    }

    return acc;
  }, []);
};

module.exports = {
  parseFilterExpression,
};
