import { ProductCreateApplicationDTO, ProductDetailDTO } from "../dtos/product-application-dto";

export default interface IProductApplication {
    createProductApplication(value: ProductDetailDTO): Promise<string>;
    getProductDetail(id: string): Promise<ProductCreateApplicationDTO>;
}