export interface IStorage<T>{
    select(): Promise<T[]>
    insert(items: T[]): Promise<void>
    update(id:number, items: Partial<T[]>): Promise<void>
}