import { ProductVariantAddDTO, ProductVariantViewDTO, ProductVariantUpdateDTO, toProductVariantViewDTO } from "../dtos/product-variant-dto";
import ProductVariant from "../models/product-variant";
import IProductVariantService from "./iproduct-variant-service";
import IGenericRepository from "@core/interfaces/igeneric-repository";

export default class ProductVariantService implements IProductVariantService {
    private productVariantRepo: IGenericRepository<ProductVariant>;

    constructor(productVariantRepo: IGenericRepository<ProductVariant>) {
        this.productVariantRepo = productVariantRepo;
    }

    async addAsync(value: ProductVariantAddDTO): Promise<string> {
        await this.productVariantRepo.addAsync(new ProductVariant(
            value.productId,
            value.size,
            value.color,
            value.price,
            value.stockQuantity
        ));
        return 'Tạo sản phẩm thành công';
    }
    async getByProductIdAsync(id: string): Promise<ProductVariantViewDTO[]> {
        const productVariants = await this.productVariantRepo.getAsync(undefined, undefined, queryDB => {
            return queryDB.select(`*`).eq('productId', id);;
        });
        const result = productVariants.data.map(pv => toProductVariantViewDTO(pv));
        return result;
    }
    async updateAsync(value: ProductVariantUpdateDTO): Promise<string> {
        await this.productVariantRepo.getByIdAsync(value.id!);
        await this.productVariantRepo.editAsync(value.id!, value);
        return Promise.resolve("Cập nhật sản phẩm thành công");
    }
    async deleteAsync(id: string): Promise<string> {
        await this.productVariantRepo.getByIdAsync(id);
        await this.productVariantRepo.removeAsync(id);
        return Promise.resolve("Xóa sản phẩm thành công");
    }

    async deleteByProductIdAsync(id: string): Promise<boolean>{
        const productVariant = await this.getByProductIdAsync(id);
        if(!productVariant) {
            return false;
        }
        productVariant.forEach(async productVariant => await this.deleteAsync(productVariant.id));
        return true;
    }
}