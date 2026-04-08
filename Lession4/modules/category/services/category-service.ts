import ICategoryService from "./icategory-service";
import IGenericRepository from "../../../core/interfaces/igeneric-repository";
import Category from "../models/category";
import { CategoryCreateDTO, CategoryUpdateDTO, CategoryViewDTO, toCategoryViewDTO } from "../dtos/category-dto";
import { PaginationResult } from "../../../core/types/common";
import { Pagination } from "../../../core/utils/pagination";

export default class CategoryService implements ICategoryService {
    private categoryRepo: IGenericRepository<Category>;

    constructor(categoryRepo: IGenericRepository<Category>) {
        this.categoryRepo = categoryRepo;
    }   

    async createCategory(value: CategoryCreateDTO): Promise<string> {
        if(value.parentId) await this.categoryRepo.addAsync(new Category(value.name, value.parentId));
        else await this.categoryRepo.addAsync(new Category(value.name));
        return Promise.resolve("Tạo danh mục thành công");
    }
    async getCategoryById(id: string): Promise<CategoryViewDTO> {
        const category = await this.categoryRepo.getByIdAsync(id);
        if(!category) return Promise.reject(Error("Không tìm thấy danh mục"));
        return toCategoryViewDTO(category);
    }
    async getAllCategories(search?: string, pageIndex?: number, pageSize?: number): Promise<PaginationResult<CategoryViewDTO>> {
        const categories = await this.categoryRepo.getAsync(pageIndex, pageSize, query => {
            if(search) query.select('*').ilike('name', `%${search}%`);
            return query;
        });

        const result = categories.data.map(c => toCategoryViewDTO(c));
        return Pagination(result, categories.count, pageSize, pageIndex);
    }

    async updateCategory(value: CategoryUpdateDTO): Promise<string> {
        if(!value.id) return Promise.reject(Error("Id không được để trống"));
        const category = await this.categoryRepo.getByIdAsync(value.id);
        if(!category) return Promise.reject(Error("Không tìm thấy danh mục"));
        await this.categoryRepo.editAsync(value.id, category);
        return "Cập nhật danh mục thành công";
    }

    async deleteCategory(id: string): Promise<string> {
        const category = await this.categoryRepo.getByIdAsync(id);
        if(!category) return Promise.reject(Error("Không tìm thấy danh mục"));
        await this.categoryRepo.removeAsync(id);
        return "Xóa danh mục thành công";
    }
    
}