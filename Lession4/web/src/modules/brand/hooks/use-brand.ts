import { BrandController } from "../controller/brand-controller";
import type { BrandUpdateDTO, BrandViewDTO } from "../dtos/brand-dto";
import type { PaginationResult } from "@core/types/common";
import { useEffect, useState, useCallback } from "react";

export function useBrand() {
    const [pagination, setPagination] = useState<PaginationResult<BrandViewDTO> | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const pageSize = 10;

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const res = await BrandController.getBrands({
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

    const createBrand = async (payload: { name: string }) => {
        try {
            setLoading(true);
            await BrandController.createBrand(payload);
            await fetchData();
        } finally {
            setLoading(false);
        }
    };

    const updateBrand = async (payload: BrandUpdateDTO) => {
        try {
            setLoading(true);
            await BrandController.updateBrand(payload);
            await fetchData();
        } finally {
            setLoading(false);
        }
    };

    const deleteBrand = async (id: string) => {
        try {
            setLoading(true);
            await BrandController.deleteBrand(id);
            await fetchData();
        } finally {
            setLoading(false);
        }
    };

    return {
        data: pagination?.data ?? [],
        pagination,
        loading,
        search,
        setSearch,
        setPageIndex,
        createBrand,
        updateBrand,
        deleteBrand,
        reload: fetchData
    };
}