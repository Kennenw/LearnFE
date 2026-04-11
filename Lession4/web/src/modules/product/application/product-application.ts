
import { ProductCreateApplicationDTO, ProductDetailDTO, ProductUpdateApplicationDTO, toProductVariantApplicationDTO } from "../dtos/product-application-dto";
import IProductVariantService from "../services/iproduct-variant-service";
import IProductApplication from "./iproduct-application";
import IProductService from '../services/iproduct-service';
import { ProductUpdateDTO } from "../dtos/product-dto";

export default class ProductApplication implements IProductApplication {
    private productService: IProductService;
    private productVariantService: IProductVariantService;

    constructor(productService: IProductService, productVariantService: IProductVariantService) {
        this.productService = productService;
        this.productVariantService = productVariantService;
    }
    async updateAsync(value: ProductUpdateApplicationDTO): Promise<string> {
        if (value.product) {
            if (!value.product.id) {
                Promise.reject("Id sản phẩm không được để trống");
            }
            await this.productService.updateAsync(value.product as ProductUpdateDTO);
        }
        if (value.variants) {
            await Promise.all(value.variants.map(async variant => {
                if (!variant.id) {
                    throw new Error("Id biến thể sản phẩm không được để trống");
                }
                await this.productVariantService.updateAsync(variant);
            }));
        }
        return "Cập nhật thành công";
    }

    async deleteAsync(id: string): Promise<string> {
        const isDeleteProduct = await this.productService.deleteAsync(id);
        if (!isDeleteProduct) {
            return Promise.reject("Không xóa được sản phẩm");
        }
        const isDeleteVariants = await this.productVariantService.deleteByProductIdAsync(id);
        if (!isDeleteVariants) {
            return Promise.reject("Không xóa được các biến thể của sản phẩm");
        }
        return Promise.resolve("Xóa sản phẩm thành công");
    }
    async createAsync(value: ProductCreateApplicationDTO): Promise<string> {
        const product = await this.productService.createAsync(value.product);
        const variantDTOs = toProductVariantApplicationDTO(product.id, value.variants);
        await Promise.all(variantDTOs.map(v => this.productVariantService.addAsync(v)));
        return Promise.resolve("Tạo thành công");
    }

    async getByIdAsync(id: string): Promise<ProductDetailDTO> {
        const product = await this.productService.getByIdAsync(id);
        const variants = await this.productVariantService.getByProductIdAsync(product.id);
        return {
            product,
            variants
        }
    }
}