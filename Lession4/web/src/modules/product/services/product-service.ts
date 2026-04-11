import { Sort } from "@core/enum/common";
import IGenericRepository from "@core/interfaces/igeneric-repository";
import { PaginationResult } from "@core/types/common";
import { ProductCreateDTO, ProductViewDTO, ProductUpdateDTO, toProductViewDTO, ProductPaginationQuery } from "../dtos/product-dto";
import Product from "../models/product";
import IProductService from "./iproduct-service";
import { Pagination } from '@core/utils/pagination';

export default class ProductService implements IProductService {
    private productRepo: IGenericRepository<Product>;

    constructor(productRepo: IGenericRepository<Product>) {
        this.productRepo = productRepo;
    }

    async createAsync(value: ProductCreateDTO): Promise<Product> {
        const product = new Product(value.name, value.description, value.categoryId, value.brandId, value.status);
        await this.productRepo.addAsync(product);
        return product;
    }

    async getAsync(query: ProductPaginationQuery): Promise<PaginationResult<ProductViewDTO>> {
        const products = await this.productRepo.getAsync(query.pageIndex, query.pageSize, queryDB => {
            let querySearch = queryDB.select(`*, categories(*), brands(*)`);
            if (queryDB.search) {
                querySearch = querySearch.ilike('name', `%${query.search}%`);
            }
            if (query.categoryId) {
                querySearch = querySearch.eq('categoryId', query.categoryId);
            }
            if (query.brandId) {
                querySearch = querySearch.eq('brandId', query.brandId);
            }
            return querySearch;
        });
        const result = products.data.map(toProductViewDTO);
        return Pagination(result, products.count, query.pageSize, query.pageIndex);
    }

    async updateAsync(value: ProductUpdateDTO): Promise<string> {
        await this.productRepo.editAsync(value.id, value);
        return Promise.resolve("Cập nhật sản phẩm thành công");
    }

    async getByIdAsync(id: string): Promise<ProductViewDTO> {
        const product = await this.productRepo.getAsync(undefined, undefined, queryDB => {
            return queryDB.select(`*, categories(*), brands(*)`)
                .eq('id', id);
        });
        return toProductViewDTO(product.data[0]);
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