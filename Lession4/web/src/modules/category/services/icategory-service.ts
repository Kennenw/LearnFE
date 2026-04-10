import { CategoryCreateDTO, CategoryPaginationQuery, CategoryUpdateDTO, CategoryViewDTO } from "../dtos/category-dto";
import { PaginationResult } from "@core/types/common";

export default interface ICategoryService {
    createAsync(value: CategoryCreateDTO): Promise<string>;
    getByIdAsync(id: string): Promise<CategoryViewDTO>;
    getAsync(query: CategoryPaginationQuery): Promise<PaginationResult<CategoryViewDTO>>;
    updateAsync(value: CategoryUpdateDTO): Promise<string>;
    deleteAsync(id: string): Promise<string>;
}