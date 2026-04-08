import { CategoryCreateDTO } from "../dtos/category-dto";

export default interface ICategoryService {
    createCategory(value: CategoryCreateDTO): Promise<string>;
    getCategoryById(id: string): Promise<any>;
    getAllCategories(): Promise<any[]>;
    updateCategory(id: string, name: string, parentId?: string): Promise<void>;
    deleteCategory(id: string): Promise<void>;
}