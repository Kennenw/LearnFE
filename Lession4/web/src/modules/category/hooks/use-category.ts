import { CategoryController } from "../controller/category-controller";
import type { CategoryCreateDTO, CategoryUpdateDTO, CategoryViewDTO } from "../dtos/category-dto";
import type { PaginationResult } from "@core/types/common";
import { useEffect, useState, useCallback } from "react";

export function useCategory() {
    const [pagination, setPagination] = useState<PaginationResult<CategoryViewDTO> | null>(null);
    const [allData, setAllData] = useState<PaginationResult<CategoryViewDTO> | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const pageSize = 10;

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const res = await CategoryController.getCategorys({
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

    const fetchAllData = useCallback(async () => {
        try {
            setLoading(true);

            const res = await CategoryController.getCategorys({});
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
    }, [fetchData, fetchAllData]);

    const setPageIndex = (page: number) => {
        if (!pagination) return;

        setPagination({
            ...pagination,
            pageIndex: page
        });
    };

    const createCategory = async (payload: CategoryCreateDTO) => {
        try {
            setLoading(true);
            await CategoryController.createCategory(payload);
            await fetchData();
        } finally {
            setLoading(false);
        }
    };

    const updateCategory = async (payload: CategoryUpdateDTO) => {
        try {
            setLoading(true);
            await CategoryController.updateCategory(payload);
            await fetchData();
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            setLoading(true);
            await CategoryController.deleteCategory(id);
            await fetchData();
        } finally {
            setLoading(false);
        }
    };

    return {
        data: pagination?.data ?? [],
        allCategory: allData,
        pagination,
        loading,
        search,
        setSearch,
        setPageIndex,
        createCategory, 
        updateCategory,
        deleteCategory,
        reload: fetchData
    };
}