export interface IPagination<T>{
    data: T[];
    totalPage: number;
    totalItems: number;
    pageIndex: number;
    pageSize: number;
    hasPreviousPage(): boolean;
    hasNextPage(): boolean;
}