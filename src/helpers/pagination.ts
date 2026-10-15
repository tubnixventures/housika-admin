export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export function parsePagination(
  rawPage?: string | null,
  rawLimit?: string | null,
  defaultLimit: number = 25,
  maxLimit: number = 100
): PaginationParams {
  const page = Math.max(1, parseInt(rawPage || '1', 10) || 1);
  const requestedLimit = parseInt(rawLimit || String(defaultLimit), 10) || defaultLimit;
  const limit = Math.min(maxLimit, Math.max(1, requestedLimit));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function paginationMeta(total: number, params: PaginationParams) {
  const totalPages = Math.ceil(total / params.limit) || 1;
  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages,
    hasNext: params.page < totalPages,
    hasPrev: params.page > 1,
  };
}
