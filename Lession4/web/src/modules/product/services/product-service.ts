import { Sort } from "@core/enum/common";
import IGenericRepository from "@core/interfaces/igeneric-repository";
import { PaginationResult } from "@core/types/common";
import Brand from "../../brand/models/brand";
import Category from "../../category/models/category";
import { ProductCreateDTO, ProductViewDTO, ProductUpdateDTO, toProductViewDTO, ProductPaginationQuery } from "../dtos/product-dto";
import Product from "../models/product";
import IProductService from "./iproduct-service";
import { Pagination } from '@core/utils/pagination';

export default class ProductService implements IProductService {
    private brandRepo: IGenericRepository<Brand>;
    private categoryRepo: IGenericRepository<Category>;
    private productRepo: IGenericRepository<Product>;

    constructor(brandRepo: IGenericRepository<Brand>, categoryRepo: IGenericRepository<Category>, productRepo: IGenericRepository<Product>) {
        this.brandRepo = brandRepo;
        this.categoryRepo = categoryRepo;
        this.productRepo = productRepo;
    }

    async createAsync(value: ProductCreateDTO): Promise<Product> {
        const product = new Product(value.name, value.description, value.categoryId, value.brandId, value.status);
        await this.productRepo.addAsync(product);
        return product;
    }

    async getAsync(query: ProductPaginationQuery): Promise<PaginationResult<ProductViewDTO>> {
        const products = await this.productRepo.getAsync(query.pageIndex, query.pageSize, queryDB => {
            let querySearch = queryDB.select(`*, product_variants(price), categories(*), brands(*)`);
            if (queryDB.search) {
                querySearch.ilike('name', `%${query.search}%`);
            }
            if (query.categoryId) {
                querySearch.eq('categoryId', query.categoryId);
            }
            if (query.brandId) {
                querySearch.eq('brandId', query.brandId);
            }
            if (query.sortByPrice) {
                querySearch = querySearch.order("product_variants.price", { ascending: query.sortByPrice === Sort.ASC });
            }
            return querySearch;
        });
        const result = await Promise.all(products.data.map(async product => {
            return toProductViewDTO(product, product.categories as Category, product.brands as Brand);
        }));
        return Pagination(result, products.count, query.pageSize, query.pageIndex);
    }

    async updateAsync(value: ProductUpdateDTO): Promise<string> {
        await this.productRepo.getByIdAsync(value.id);
        await this.productRepo.editAsync(value.id, value);
        return Promise.resolve("Cập nhật sản phẩm thành công");
    }

    async getByIdAsync(id: string): Promise<ProductViewDTO> {
        const product = await this.productRepo.getByIdAsync(id);
        if (!product) {
            return Promise.reject(new Error("Sản phẩm không tồn tại"));
        }
        const brand = await this.brandRepo.getByIdAsync(product.brandId);
        if (!brand) {
            return Promise.reject(new Error("Hãng không tồn tại"));
        }
        const category = await this.categoryRepo.getByIdAsync(product.categoryId);
        if (!category) {
            return Promise.reject(new Error("Danh mục sản phẩm không tồn tại"));
        }
        return toProductViewDTO(product, category, brand);
    }

    async deleteAsync(id: string): Promise<boolean> {
        const product = await this.productRepo.getByIdAsync(id);
        if (product) {
            await this.productRepo.removeAsync(id);
            return true;
        }
        return false;
    }
}