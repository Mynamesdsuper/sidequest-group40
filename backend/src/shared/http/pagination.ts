import { v } from '../validation';

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

/** Query rules for ?page=&pageSize= (use inside validate({ query: v.object({ ...paginationQuery, ... }) })). */
export const paginationQuery = {
  page: v.int({ min: 1 }).optional(),
  pageSize: v.int({ min: 1, max: MAX_PAGE_SIZE }).optional(),
};

export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

/** Turns page/pageSize into Sequelize limit/offset. */
export function toLimitOffset(page = 1, pageSize = DEFAULT_PAGE_SIZE): { limit: number; offset: number } {
  return { limit: pageSize, offset: (page - 1) * pageSize };
}

export function toPage<T>(items: T[], total: number, page = 1, pageSize = DEFAULT_PAGE_SIZE): Page<T> {
  return { items, page, pageSize, total };
}
