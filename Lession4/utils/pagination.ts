import { IPagination } from "../types/common";

export function Pagination<T>(data: T[],
    totalItems: number,
    pageSize: number,
    pageIndex: number): IPagination<T> {

    const totalPage = Math.ceil(totalItems / pageSize);
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
