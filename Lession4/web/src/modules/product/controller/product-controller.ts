import GenericRepository from "@infrastructure/database/repositories/generic-repository";
import IGenericRepository from "@core/interfaces/igeneric-repository";
import Product from "../models/product";
import ProductVariant from "../models/product-variant";
import IProductService from "../services/iproduct-service";
import ProductService from "../services/product-service";
import IProductVariantService from "../services/iproduct-variant-service";
import ProductVariantService from "../services/product-variant-service";
import IProductApplication from "../application/iproduct-application";
import ProductApplication from "../application/product-application";
import { ProductPaginationQuery } from "../dtos/product-dto";
import { ProductCreateApplicationDTO, ProductUpdateApplicationDTO } from "../dtos/product-application-dto";

const productRepo: IGenericRepository<Product> = new GenericRepository<Product>('products');
const productVariantRepo: IGenericRepository<ProductVariant> = new GenericRepository<ProductVariant>('product_variants');
const productService: IProductService = new ProductService(productRepo);
const productVariantService: IProductVariantService = new ProductVariantService(productVariantRepo);
const productApplication: IProductApplication = new ProductApplication(productService, productVariantService);

export const ProductController = {
    async getProducts(query: ProductPaginationQuery) {
        return await productService.getAsync(query);
    },

    async getProductId(id: string) {
        return await productApplication.getByIdAsync(id);
    },

    async createProduct(data: ProductCreateApplicationDTO) {
        return await productApplication.createAsync(data);
    },

    async updateProduct(data: ProductUpdateApplicationDTO) {
        return await productApplication.updateAsync(data);
    },

    async deleteProduct(id: string) {
        return await productApplication.deleteAsync(id);
    },

    async removeVariantProduct(id: string) {
        return await productVariantService.deleteAsync(id);
    }
};