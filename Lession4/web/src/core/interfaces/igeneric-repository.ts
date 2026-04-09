export default interface IGenericRepository<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAsync(pageIndex?: number, pageSize?: number, queryCallBack?: (query: any) => any): Promise<{ data: T[]; count: number }>;
    getByIdAsync(id: string): Promise<T | undefined>;
    addAsync(data: T[] | T): Promise<T[] | T>;
    removeAsync(id: string): Promise<void>;
    editAsync(id: string, newData: Partial<T[] | T>): Promise<void>;
}