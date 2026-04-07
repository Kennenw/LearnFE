import { supabase } from "../supabase";
import IGenericRepository from "../../../core/interfaces/igeneric-repository";
export default class GenericRepository<T> implements IGenericRepository<T>{
    private tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }
    async getAsync(pageIndex: number = 1, pageSize: number = 10, queryCallBack?: (query: any) => any): Promise<{ data: T[]; count: number }> {
        const from = (pageIndex - 1) * pageSize;
        const to = from + pageSize - 1;
        const { count } = await supabase.from(this.tableName).select('*', { count: 'exact', head: true });
        let query: any = supabase.from(this.tableName).select("*");
        if (queryCallBack)
            query = queryCallBack(query);
        query.range(from, to);
        const { data, error } = await query;
        if (error) throw new Error(`Lỗi khi lấy data: ${error}`);
        return { data: data, count: count ?? 0 };
    }

    async getByIdAsync(id: string): Promise<T | undefined> {
        const { data, error } = await supabase.from(this.tableName).select("*").eq('id', id);
        if (error) throw new Error(`Lỗi khi lấy data: ${error}`);
        if (data) return data as T;
        else return undefined;
    }

    async addAsync(data: T[] | T): Promise<void> {
        const arrData = Array.isArray(data) ? data : [data];
        const { error } = await supabase
            .from(this.tableName)
            .insert(arrData);
        if (error) throw new Error(`Lỗi lưu data: ${error}`);
    }

    async removeAsync(id: string): Promise<void> {
        const { error } = await supabase
            .from(this.tableName)
            .delete()
            .eq('id', id);
        if (error) throw new Error(`Lỗi xóa data: ${error}`);
    }

    async editAsync(id: string, newData: Partial<T[] | T>): Promise<void> {
        const arrData = Array.isArray(newData) ? newData : [newData];
        const { error } = await supabase
            .from(this.tableName)
            .update(arrData)
            .eq('id', id);
        if (error) throw new Error(`Lỗi cập nhật data: ${error}`);
    }

}