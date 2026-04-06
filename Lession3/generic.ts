export class Generic<T> {

    private value: T[];

    constructor(value: T[] | []) {
        this.value = value;
    }

    get(): T[] {
        return this.value;
    }

    getById(id: number, name?: string): T | undefined {
        let item = this.value.find((e: any) => e.id === id);
        if (typeof item === "undefined"){
            console.log(`Không tìm thấy ${name} với ID ${id}`);
            return undefined;
        }
        else return item;
    }

    edit(entity: T, value: Partial<T>): void {
        for(const key in value){
            if(value[key] !== undefined && value[key] !== ""){
                entity[key] = value[key];
            }
        }
        console.log("Cập nhật thành công");
    }

    add(value: T): void {
        this.value.push(value);
        console.log("Thêm thành công");
    }

    remove(id: number): void {
        let index = this.value.findIndex((x: any) => x.id === id);
        if (index === -1)
            console.log("Không tìm thấy để xóa");
        else
            console.log("Xóa thành công");
    }
}