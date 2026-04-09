import { CategoryCreateDTO, CategoryUpdateDTO, CategoryViewDTO } from "../dtos/category-dto";
import { PaginationResult } from "@core/types/common";

export default interface ICategoryService {
    createCategory(value: CategoryCreateDTO): Promise<string>;
    getCategoryById(id: string): Promise<CategoryViewDTO>;
    getAllCategories(search?: string, pageIndex?: number, pageSize?: number): Promise<PaginationResult<CategoryViewDTO>>;
    updateCategory(value: CategoryUpdateDTO): Promise<string>;
    deleteCategory(id: string): Promise<string>;
}