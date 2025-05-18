// src/app/core/models/category.models.ts
export interface Category {
  id: number;
  name: string;
  description: string;
  creationDate: string;
  deleted: boolean;
  createdUser: number;
  lastModificationDate: string;
  lastModificationUser: number;
  frameworksCount: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  firstItemIndex: number;
  lastItemIndex: number;
}