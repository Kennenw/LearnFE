import ICategoryService from "./icategory-service";
import IGenericRepository from "@core/interfaces/igeneric-repository";
import Category from "../models/category";
import { CategoryCreateDTO, CategoryPaginationQuery, CategoryUpdateDTO, CategoryViewDTO, toCategoryViewDTO } from "../dtos/category-dto";
import { PaginationResult } from "@core/types/common";
import { Pagination } from "@core/utils/pagination";

export default class CategoryService implements ICategoryService {
    private categoryRepo: IGenericRepository<Category>;

    constructor(categoryRepo: IGenericRepository<Category>) {
        this.categoryRepo = categoryRepo;
    }   

    async createAsync(value: CategoryCreateDTO): Promise<string> {
        if(value.parentId) {
            await this.categoryRepo.addAsync(new Category(value.name, value.parentId));
        } else {
            await this.categoryRepo.addAsync(new Category(value.name));
        }
        return Promise.resolve("Tạo danh mục thành công");
    }
    async getByIdAsync(id: string): Promise<CategoryViewDTO> {
        const category = await this.categoryRepo.getByIdAsync(id);
        if(!category) {
            return Promise.reject(Error("Không tìm thấy danh mục"));
        }
        return toCategoryViewDTO(category);
    }
    async getAsync(query: CategoryPaginationQuery): Promise<PaginationResult<CategoryViewDTO>> {
        const categories = await this.categoryRepo.getAsync(query.pageIndex, query.pageSize, queryDB => {
            let querySearch = queryDB.select('*');
            if(query.search) {
                querySearch = querySearch.ilike('name', `%${query.search}%`);;
            }
            return querySearch;
        });

        const result = categories.data.map(c => toCategoryViewDTO(c));
        return Pagination(result, categories.count, query.pageSize, query.pageIndex);
    }

    async updateAsync(value: CategoryUpdateDTO): Promise<string> {
        if(!value.id) {
            return Promise.reject(Error("Id danh mục không được để trống"));
        }
        await this.getByIdAsync(value.id);
        await this.categoryRepo.editAsync(value.id, value);
        return "Cập nhật danh mục thành công";
    }

    async deleteAsync(id: string): Promise<string> {
        const category = await this.getByIdAsync(id);
        if(!category) {
            return Promise.reject(Error("Không tìm thấy danh mục"));
        }
        await this.categoryRepo.removeAsync(id);
        return "Xóa danh mục thành công";
    }
    
}