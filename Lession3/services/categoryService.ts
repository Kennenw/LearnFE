import { Category } from "../entities/Category";
import {Generic} from "../generic";
import {writeNumberCheck, writeCheck} from "../utils/prompt";

export class CategoryService{
    private generic: Generic<Category>;

    constructor(generic: Generic<Category>){
        this.generic = generic;
    }

    addCategory(): void{
        console.log("Nhập thông tin loại sách");
        const id = this.generic.get().length + 1;
        const name = writeCheck("Nhập tên loại sách: ", "Tên loại sách");
        this.generic.add(new Category(id, name));   
        console.log("");
    }

    removeCategory(): void{
        const id = writeNumberCheck("Nhập id loại sách cần xóa: ", "ID loại sách");
        this.generic.remove(id);
    }

    getAllCategory(): void {
        let list = this.generic.get();
        if(list.length)
            list.forEach(c => console.log(c.display()));
        else console.log("Không có item nào");
    }

    getCategoryByID(): Category | undefined{
        const id = writeNumberCheck("Nhập id loại sách cần tìm: ", "ID loại sách");
        return this.generic.getById(id, "loại sách");
    }

    editCategoryByID(): void{
        const item = this.getCategoryByID();
        if(item instanceof Category){
            const name = writeCheck("Nhập tên loại sách cập nhật: ");
            if(name === undefined) return;
            this.generic.edit(item, {name: name});
        }
    }
}