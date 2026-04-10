export interface PaginationResult<T>{
    data: T[];
    totalPage: number;
    totalItems: number | null;
    pageIndex: number | 1;
    pageSize: number;
    hasPreviousPage(): boolean;
    hasNextPage(): boolean;
}

export interface PaginationQuery{
    search?: string;
    pageIndex?: number;
    pageSize?: number;
}