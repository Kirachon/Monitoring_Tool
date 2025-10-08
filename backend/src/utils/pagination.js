function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page ?? '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? '20', 10) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

function wrapResponse(items, total, page, limit) {
  return {
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil((total || 0) / (limit || 1))),
    },
  };
}

module.exports = { parsePagination, wrapResponse };

