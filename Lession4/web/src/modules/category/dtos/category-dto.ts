import { PaginationQuery } from "@core/types/common";
import Category from "../models/category";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CategoryViewDTO extends Category{
    
}

export interface CategoryCreateDTO{
    name: string;
    parentId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CategoryPaginationQuery extends PaginationQuery {
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CategoryUpdateDTO extends Partial<Category>{
}

export function toCategoryViewDTO(category: Category): CategoryViewDTO{
    return {
        id: category.id,
        name: category.name,
        parentId: category.parentId
    }
}