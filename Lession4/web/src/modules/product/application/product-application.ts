
import { ProductCreateApplicationDTO, toProductVariantApplicationDTO } from "../dtos/product-application-dto";
import IProductVariantService from "../services/iproduct-variant-service";
import IProductApplication from "./iproduct-application";
import IProductService from '../services/iproduct-service';

export default class ProductApplication implements IProductApplication {
    private productService: IProductService;
    private productVariantService: IProductVariantService;

    constructor(productService: IProductService, productVariantService: IProductVariantService) {
        this.productService = productService;
        this.productVariantService = productVariantService;
    }
    async createProductApplication(value: ProductCreateApplicationDTO): Promise<string> {
        const product = await this.productService.createProduct(value.product);
        const variantDTO = toProductVariantApplicationDTO(product.id, value.variant);
        variantDTO.map(async v => {
            await this.productVariantService.addProductVariant(v);
        });
        return Promise.resolve("Tạo thành công");
    }

    async getProductDetail(id: string): Promise<ProductCreateApplicationDTO> {
        const product = await this.productService.getProductById(id);
        const variant = await this.productVariantService.getVariantByProductId(product.id);
        return {
            product,
            variant
        }
    }
}