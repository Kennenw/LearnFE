import { supabase } from '../supabase';
import IGenericRepository from '@core/interfaces/igeneric-repository';
export default class GenericRepository<T> implements IGenericRepository<T> {
    private tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getAsync(pageIndex?: number, pageSize?: number, queryCallBack?: (query: any) => any): Promise<{ data: T[]; count: number }> {
        const { count } = await supabase.from(this.tableName).select('*', { count: 'exact', head: true });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let query: any = supabase.from(this.tableName);
        if (queryCallBack) {
            query = queryCallBack(query);
        }
        if (pageIndex && pageSize) {
            const from = (pageIndex - 1) * pageSize;
            const to = from + pageSize - 1;
            query = query.range(from, to);
        }
        const { data, error } = await query;
        if (error) {
            return Promise.reject(Error(`Error fetching data: ${error}`));
        };
        console.log({ data: data, count: count ?? 0 })
        return { data: data, count: count ?? 0 };
    }

    async getByIdAsync(id: string): Promise<T | undefined> {
        const { data, error } = await supabase.from(this.tableName).select("*").eq('id', id);
        if (error) {
            return Promise.reject(Error(`Error fetching data by ID: ${error}`));
        }
        if (data) {
            return data as T;
        } else {
            return undefined;
        }
    }

    async addAsync(data: T[] | T): Promise<T[] | T> {
        const arrData = Array.isArray(data) ? data : [data];
        const { error } = await supabase
            .from(this.tableName)
            .insert(arrData);
        if (error) {
            return Promise.reject(Error(`Error saving data: ${error}`));
        }
        return data;
    }

    async removeAsync(id: string): Promise<void> {
        const { error } = await supabase
            .from(this.tableName)
            .delete()
            .eq('id', id);
        if (error) {
            return Promise.reject(Error(`Error deleting data: ${error}`));
        }
    }

    async editAsync(id: string, newData: Partial<T[] | T>): Promise<void> {
        const arrData = Array.isArray(newData) ? newData : [newData];
        const { error } = await supabase
            .from(this.tableName)
            .update(arrData)
            .eq('id', id);
        if (error) {
            return Promise.reject(Error(`Error updating data: ${error}`));
        }
    }

}