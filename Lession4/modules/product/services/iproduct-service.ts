import { ProductCreateDTO, ProductUpdateDTO, ProductViewDTO } from "../dtos/product-dto";
import {PaginationResult} from "../../../core/types/common";
import { Sort } from "../../../core/enum/common";
import Product from "../models/product";

export default interface IProductService {
    createProduct(value: ProductCreateDTO): Promise<Product>;
    getAllProducts(search?: string, categoryId?: string, brandId?: string, sortBy?: Sort, pageIndex?: number, pageSize?: number): Promise<PaginationResult<ProductViewDTO>>;
    updateProduct(value: ProductUpdateDTO): Promise<string>;
    deleteProduct(id: string): Promise<string>;
    getProductById(id: string): Promise<ProductViewDTO>;
}