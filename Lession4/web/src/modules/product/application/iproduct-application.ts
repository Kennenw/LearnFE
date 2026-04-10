import { ProductCreateApplicationDTO, ProductDetailDTO, ProductUpdateApplicationDTO } from "../dtos/product-application-dto";

export default interface IProductApplication {
    createAsync(value: ProductCreateApplicationDTO): Promise<string>;
    getByIdAsync(id: string): Promise<ProductDetailDTO>;
    updateAsync(value: ProductUpdateApplicationDTO): Promise<string>;
    deleteAsync(id: string): Promise<string>;
}