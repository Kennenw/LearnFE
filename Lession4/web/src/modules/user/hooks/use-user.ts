import type { PaginationResult } from "@core/types/common";
import { useEffect, useState, useCallback } from "react";
import { UserCreateDTO, UserUpdateDTO, UserViewDTO } from "../dtos/user-dto";
import { UserController } from "../controller/user-cotroller";
import { Role } from "@core/enum/user";

export function useUser() {
    const [pagination, setPagination] = useState<PaginationResult<UserViewDTO> | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const pageSize = 10;

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const res = await UserController.getUsers({
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

    const createUser = async (payload: UserCreateDTO) => {
        try {
            setLoading(true);
            await UserController.createUser(payload);
            await fetchData();
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (id: string, payload: UserUpdateDTO) => {
        try {
            setLoading(true);
            await UserController.updateUser(id, payload);
            await fetchData();
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: string) => {
        try {
            setLoading(true);
            await UserController.deleteUser(id);
            await fetchData();
        } finally {
            setLoading(false);
        }
    };

    const banUser = async (id: string) => {
        try {
            setLoading(true);
            await UserController.banUser(id);
            await fetchData();
        } finally {
            setLoading(false);
        }
    };

    const unBanUser = async (id: string) => {
        try {
            setLoading(true);
            await UserController.unBanUser(id);
            await fetchData();
        } finally {
            setLoading(false);
        }
    };

    const decentralieUser = async (id: string, role: Role) => {
        try {
            setLoading(true);
            await UserController.decentralieUser(id, role);
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
        createUser,
        updateUser,
        deleteUser,
        unBanUser,
        banUser,
        decentralieUser,
        reload: fetchData
    };
}