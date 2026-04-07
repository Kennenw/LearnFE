import { IPagination } from "../types/common";
import { Pagination } from "../utils/pagination";
import { IStorage } from "../types/storage";
import { LowDbStorage } from "../adapters/supabase";

export default class GenericRepository<T> {
    private value: T[] = [];
    private filePath: string = '../data/db.json';
    private storage: IStorage<T>;

    constructor() {
        this.storage = new LowDbStorage<T>(this.filePath); 
    }

    async load(): Promise<void>{
        this.value = await this.storage.load();
    }

    async save(): Promise<void>{
        await this.storage.save(this.value);
    }

    async get(pageIndex: number = 1, pageSize = 10, filterFn?: (items: T[]) => T[]): Promise<IPagination<T>> {
        await this.load();
        let data = this.value;
        if(filterFn)
            data = filterFn(data);
        return Pagination(data, data.length, pageSize, pageIndex);
    }

    async getById(id: number): Promise<T | undefined> {
        await this.load();
        return this.value.find((x: any) => x.id === id);
    }

    async add(data: T): Promise<void> {
        this.value.push(data);
    }

    async remove(id: number): Promise<boolean> {
        const index = this.value.findIndex((x: any) => x.id === id);
        if (index === -1) return false;
        this.value.splice(index, 1);
        return true;
    }

    async edit(data: T, newData: Partial<T>): Promise<void> {
        for (let key in newData) {
            if (newData[key] !== undefined && newData[key] !== "")
                data[key] = newData[key];
        }
    }

}