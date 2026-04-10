import { BrandController } from "../controller/brand-controller";
import type { BrandCreateDTO, BrandUpdateDTO, BrandViewDTO } from "../dtos/brand-dto";
import type { PaginationResult } from "@core/types/common";
import { useEffect, useState, useCallback } from "react";

export function useBrand() {
    const [pagination, setPagination] = useState<PaginationResult<BrandViewDTO> | null>(null);
    const [allData, setAllData] = useState<PaginationResult<BrandViewDTO> | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 10;

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const res = await BrandController.getBrands({
                search,
                pageIndex,
                pageSize
            });
            setPagination(res);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [pageIndex, search]);

    const fetchAllData = useCallback(async () => {
            try {
                setLoading(true);
    
                const res = await BrandController.getBrands({});
                setAllData(res);
    
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        fetchData();
        fetchAllData();
    }, [fetchAllData, fetchData]);

    const setPage = (page: number) => {
        if (page < 1) return;
        setPageIndex(page);
    };

    const createBrand = async (payload: BrandCreateDTO) => {
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
        allBrand: allData,
        pagination,
        loading,
        search,
        setSearch: handleSearch,
        setPageIndex: setPage,
        createBrand,
        updateBrand,
        deleteBrand,
        reload: fetchData
    };
}