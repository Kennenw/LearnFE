import { IStorage } from "../types/storage";
import { supabase } from "./supabase";

export default class SupabaseStorage<T> implements IStorage<T> {
    private tableName: string;
    constructor(tableName: string) {
        this.tableName = tableName;
    }
    async select(): Promise<T[]> {
        const {data, error} = await supabase
                                .from(this.tableName)
                                .select('*');
        if(error) throw new Error(`Lỗi gọi dữ liệu DB Supabase: ${error}`);
        return data ?? [];
    }

    async insert(items: T[]): Promise<void> {
        const {error} = await supabase
            .from(this.tableName)
            .insert(items);
        if(error) throw new Error(`Lỗi lưu data vào DB Supabase: ${error}`);
    }

}