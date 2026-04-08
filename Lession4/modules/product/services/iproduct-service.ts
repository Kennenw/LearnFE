import { ProductCreateDTO, ProductUpdateDTO, ProductViewDTO } from "../dtos/product-dto";
import {PaginationResult} from "../../../core/types/common";
import { Sort } from "../../../core/enum/common";

export default interface IProductService {
    createProduct(value: ProductCreateDTO): Promise<string>;
    getAllProducts(search?: string, categoryId?: string, brandId?: string, sortBy?: Sort, pageIndex?: number, pageSize?: number): Promise<PaginationResult<ProductViewDTO>>;
    updateProduct(value: ProductUpdateDTO): Promise<string>;
    deleteProduct(id: string): Promise<string>;
}