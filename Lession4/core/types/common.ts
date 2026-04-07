export interface PaginationResult<T>{
    data: T[];
    totalPage: number | 1;
    totalItems: number | null;
    pageIndex: number;
    pageSize: number;
    hasPreviousPage(): boolean;
    hasNextPage(): boolean;
}