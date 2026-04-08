import { PaginationResult } from "../../../core/types/common";
import { ProductVariantAddDTO, ProductVariantViewDTO, ProductVariantUpdateDTO, toProductVariantViewDTO } from "../dtos/product-variant-dto";
import ProductVariant from "../models/product-variant";
import IProductVariantService from "./iproduct-variant-service";
import IGenericRepository from "../../../core/interfaces/igeneric-repository";
import Product from "../models/product";
import { Pagination } from '../../../core/utils/pagination'

export default class ProductVariantService implements IProductVariantService {
    private productVariantRepo: IGenericRepository<ProductVariant>;
    private productRepo: IGenericRepository<Product>;

    constructor(productVariantRepo: IGenericRepository<ProductVariant>, productRepo: IGenericRepository<Product>) {
        this.productVariantRepo = productVariantRepo;
        this.productRepo = productRepo;
    }

    async addProductVariant(value: ProductVariantAddDTO): Promise<string> {
        await this.productVariantRepo.addAsync(new ProductVariant(
            value.productId,
            value.size,
            value.color,
            value.price,
            value.stockQuantity
        ));
        return 'Tạo sản phẩm thành công';
    }
    async getVariantByProductId(id: string): Promise<ProductVariantViewDTO[]> {
        const product = await this.productRepo.getByIdAsync(id);
        if (!product) return Promise.reject(new Error("Sản phẩm không tồn tại"));
        const productVariants = await this.productVariantRepo.getAsync(undefined, undefined, query => {
            return query.select(`*`).eq('productId', id);;
        });
        const result = productVariants.data.map(pv => toProductVariantViewDTO(pv));
        return result;
    }
    async updateProductVariant(id: string, value: ProductVariantUpdateDTO): Promise<string> {
        const productVariant = await this.productVariantRepo.getByIdAsync(id);
        if (!productVariant) return Promise.reject(new Error("Sản phẩm không tồn tại"));
        await this.updateProductVariant(id, value);
        return Promise.resolve("Cập nhật sản phẩm thành công");
    }
    deleteProductVariant(id: string): Promise<string> {
        const product = this.productVariantRepo.getByIdAsync(id);
        if (!product) return Promise.reject(new Error("Sản phẩm không tồn tại"));
        this.productVariantRepo.removeAsync(id);
        return Promise.resolve("Xóa sản phẩm thành công");
    }

}