import { PaginationResult } from '../types/common';

export function Pagination<T>(data: T[],
    totalItems: number | null,
    pageSize?: number,
    pageIndex?: number): PaginationResult<T> {
    if (pageSize === undefined || pageSize <= 0) {
        pageSize = 10;
    }
    if (pageIndex === undefined || pageIndex <= 0) {
        pageIndex = 1;
    }
    const totalPage = Math.ceil(totalItems ?? 0 / pageSize);
    const pagedData = data.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

    return {
        data: pagedData,
        totalPage,
        totalItems,
        pageIndex,
        pageSize,
        hasPreviousPage: () => pageIndex > 1,
        hasNextPage: () => pageIndex < totalPage
    }
};
