import { ProductCreateDTO, ProductPaginationQuery, ProductUpdateDTO, ProductViewDTO } from "../dtos/product-dto";
import {PaginationResult} from "@core/types/common";
import Product from "../models/product";

export default interface IProductService {
    createAsync(value: ProductCreateDTO): Promise<Product>;
    getAsync(query?: ProductPaginationQuery): Promise<PaginationResult<ProductViewDTO>>;
    updateAsync(value: ProductUpdateDTO): Promise<string>;
    deleteAsync(id: string): Promise<boolean>;
    getByIdAsync(id: string): Promise<ProductViewDTO>;
}