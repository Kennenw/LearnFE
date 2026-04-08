import { Sort } from "../../../core/enum/common";
import IGenericRepository from "../../../core/interfaces/igeneric-repository";
import { PaginationResult } from "../../../core/types/common";
import Brand from "../../brand/models/brand";
import Category from "../../category/models/category";
import { ProductCreateDTO, ProductViewDTO, ProductUpdateDTO, toProductViewDTO } from "../dtos/product-dto";
import Product from "../models/product";
import IProductService from "./iproduct-service";
import { Pagination } from '../../../core/utils/pagination';

export default class ProductService implements IProductService {
    private brandRepo: IGenericRepository<Brand>;
    private categoryRepo: IGenericRepository<Category>;
    private productRepo: IGenericRepository<Product>;

    constructor(brandRepo: IGenericRepository<Brand>, categoryRepo: IGenericRepository<Category>, productRepo: IGenericRepository<Product>) {
        this.brandRepo = brandRepo;
        this.categoryRepo = categoryRepo;
        this.productRepo = productRepo;
    }

    async createProduct(value: ProductCreateDTO): Promise<Product> {
        const product = new Product(value.name, value.description, value.categoryId, value.brandId, value.status);
        await this.productRepo.addAsync(product);
        return product;
    }

    async getAllProducts(search?: string, categoryId?: string, brandId?: string, sortBy?: Sort, pageIndex?: number, pageSize?: number): Promise<PaginationResult<ProductViewDTO>> {
        const products = await this.productRepo.getAsync(pageIndex, pageSize, query => {
            query = query.select(`*,
                                 variants!inner(*)
                                `);
            if (search) query.ilike('name', `%${search}%`);
            query;
            if (categoryId) query.eq('categoryId', categoryId);
            query;
            if (brandId) query.eq('brandId', brandId);
            query;
            if (sortBy)
                query = query.order("price", { ascending: sortBy === Sort.ASC });
            return query;
        });

        const result = await Promise.all(products.data.map(async p => {
            const brand = await this.brandRepo.getByIdAsync(p.brandId);
            const category = await this.categoryRepo.getByIdAsync(p.categoryId);
            return toProductViewDTO(p, category!, brand!);
        }));

        return Pagination(result, products.count, pageIndex, pageSize);
    }

    async updateProduct(value: ProductUpdateDTO): Promise<string> {
        const product = await this.productRepo.getByIdAsync(value.id);
        if (!product) return Promise.reject(new Error("Sản phẩm không tồn tại"));
        await this.productRepo.editAsync(value.id, value);
        return Promise.resolve("Cập nhật sản phẩm thành công");
    }

    async getProductById(id: string): Promise<ProductViewDTO> {
        const product = await this.productRepo.getByIdAsync(id);
        if (!product) return Promise.reject(new Error("Sản phẩm không tồn tại"));
        const brand = await this.brandRepo.getByIdAsync(product.brandId);
        if (!brand) return Promise.reject(new Error("Hãng không tồn tại"));
        const category = await this.categoryRepo.getByIdAsync(product.categoryId);
        if (!category) return Promise.reject(new Error("Danh mục sản phẩm không tồn tại"));
        return toProductViewDTO(product, category, brand);
    }

    async deleteProduct(id: string): Promise<string> {
        const product = await this.productRepo.getByIdAsync(id);
        if (!product) return Promise.reject(new Error("Sản phẩm không tồn tại"));
        await this.productRepo.removeAsync(id);
        return Promise.resolve("Xóa sản phẩm thành công");
    }
}