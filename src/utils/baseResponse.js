'use strict';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const toPositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

const getPaginationParams = (query = {}) => {
  const page = toPositiveInt(query.page, DEFAULT_PAGE);
  const rawLimit = toPositiveInt(query.limit, DEFAULT_LIMIT);
  const limit = Math.min(rawLimit, MAX_LIMIT);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

const buildPaginationMeta = ({ count, page, limit }) => {
  const totalItems = count;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

const success = ({
  message = 'Success',
  data = null,
  meta = null,
}) => {
  return {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };
};

const error = ({
  message = 'Internal Server Error',
  errors = null,
}) => {
  return {
    success: false,
    message,
    ...(errors ? { errors } : {}),
  };
};

module.exports = {
  getPaginationParams,
  buildPaginationMeta,
  success,
  error,
};
