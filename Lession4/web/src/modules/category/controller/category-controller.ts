import Category from "../models/category";
import GenericRepository from "@infrastructure/database/repositories/generic-repository";
import IGenericRepository from "@core/interfaces/igeneric-repository";
import  ICategoryService  from "../services/icategory-service";
import  CategoryService  from "../services/category-service";
import { CategoryCreateDTO, CategoryPaginationQuery, CategoryUpdateDTO } from "../dtos/category-dto";

const categoryRepo: IGenericRepository<Category> = new GenericRepository<Category>('categories');
const categoryService: ICategoryService = new CategoryService(categoryRepo);

export const CategoryController = {
    async getCategorys(query: CategoryPaginationQuery) {
        return await categoryService.getAsync(query);
    },

    async getCategoryById(id: string) {
        return await categoryService.getByIdAsync(id);
    },

    async createCategory(data: CategoryCreateDTO) {
        return await categoryService.createAsync(data);
    },

    async updateCategory(data: CategoryUpdateDTO) {
        return await categoryService.updateAsync(data);
    },

    async deleteCategory(id: string) {
        return await categoryService.deleteAsync(id);
    }
};