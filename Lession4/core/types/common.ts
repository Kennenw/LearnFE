export interface PaginationResult<T>{
    data: T[];
    totalPage: number;
    totalItems: number | null;
    pageIndex: number;
    pageSize: number;
    hasPreviousPage(): boolean;
    hasNextPage(): boolean;
}