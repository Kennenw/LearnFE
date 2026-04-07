export default interface IGenericRepository<T> {
    getAsync(pageIndex: number, pageSize: number, queryCallBack?: (query: any) => any): Promise<{ data: T[]; count: number }>;
    getByIdAsync(id: string): Promise<T | undefined>;
    addAsync(data: T[] | T): Promise<void>;
    removeAsync(id: string): Promise<void>;
    editAsync(id: string, newData: Partial<T[] | T>): Promise<void>;
}