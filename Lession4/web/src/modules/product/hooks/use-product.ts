import type { PaginationResult } from "@core/types/common";
import { useEffect, useState, useCallback } from "react";
import { ProductViewDTO } from "../dtos/product-dto";
import { ProductController } from "../controller/product-controller";
import { ProductCreateApplicationDTO, ProductDetailDTO, ProductUpdateApplicationDTO } from "../dtos/product-application-dto";

export function useProduct() {
    const [pagination, setPagination] = useState<PaginationResult<ProductViewDTO> | null>(null);
    const [product, setProduct] = useState<ProductDetailDTO>();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const pageSize = 10;

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const res = await ProductController.getProducts({
                search,
                pageIndex: pagination?.pageIndex ?? 1,
                pageSize
            });
            setPagination(res);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [search, pagination?.pageIndex]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const setPageIndex = (page: number) => {
        if (!pagination) return;

        setPagination({
            ...pagination,
            pageIndex: page
        });
    };

    const createProduct = async (payload: ProductCreateApplicationDTO) => {
        try {
            setLoading(true);
            await ProductController.createProduct(payload);
            await fetchData();
        } finally {
            setLoading(false);
        }
    };

    const fetchProductDetail = async (id: string) => {
        try {
            setLoading(true);
            const product = await ProductController.getProductId(id);
            setProduct(product);
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (payload: ProductUpdateApplicationDTO) => {
        try {
            setLoading(true);
            await ProductController.updateProduct(payload);
            await fetchData();
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            setLoading(true);
            await ProductController.deleteProduct(id);
            await fetchData();
        } finally {
            setLoading(false);
        }
    };

    const removeVariant = async (productId: string, variantId: string) => {
        try {
            setLoading(true);
            await ProductController.removeVariantProduct(variantId);
            await fetchProductDetail(productId);
        } finally {
            setLoading(false);
        }
    }

    return {
        data: pagination?.data ?? [],
        productDetail: product,
        pagination,
        loading,
        search,
        setSearch,
        setPageIndex,
        createProduct,
        updateProduct,
        deleteProduct,
        removeVariant,
        fetchProductDetail,
        reload: fetchData
    };
}