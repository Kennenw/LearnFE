import ICategoryService from "./icategory-service";
import IGenericRepository from "../../../core/interfaces/igeneric-repository";
import Category from "../models/category";
import { CategoryCreateDTO } from "../dtos/category-dto";

export default class CategoryService implements ICategoryService {
    private categoryRepo: IGenericRepository<Category>;

    constructor(categoryRepo: IGenericRepository<Category>) {
        this.categoryRepo = categoryRepo;
    }   

    createCategory(value: CategoryCreateDTO): Promise<string> {
        if(value.parentId) this.categoryRepo.addAsync(new Category(value.name, value.parentId));
        else this.categoryRepo.addAsync(new Category(value.name));
        return Promise.resolve("Category created successfully");
    }
    getCategoryById(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getAllCategories(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    updateCategory(id: string, name: string, parentId?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteCategory(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}