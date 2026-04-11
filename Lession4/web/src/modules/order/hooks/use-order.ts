import { useState } from "react";
import { OrderStatus } from "@core/enum/order";
import { PaginationResult } from "@core/types/common";
import { OrderViewDTO } from "../dtos/order-dto";
import { OrderController } from "../controller/order-controller";
import { OrderApplicationCreateDTO } from "../dtos/order-application-dto";

export function useOrder() {
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationResult<OrderViewDTO> | null>(null);
    const [search, setSearch] = useState("");
    const pageSize = 10;

    const fetchOrders = async (page: number = 1) => {
        try {
            setLoading(true);
            const res = await OrderController.getOrders({
                pageIndex: page,
                pageSize,
                search
            });
            setPagination(res);
        } finally {
            setLoading(false);
        }
    };

    const createOrder = async (payload: OrderApplicationCreateDTO) => {
        try {
            setLoading(true);
            const orderId = await OrderController.createOrder(payload);
            return orderId;
        } catch (err) {
            console.error("Order creation failed:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getOrdersByUser = async (userId: string) => {
        try {
            setLoading(true);
            return await OrderController.getOrdersByUserId(userId);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: OrderStatus) => {
        try {
            setLoading(true);
            await OrderController.updateOrderStatus(id, status);
            await fetchOrders(pagination?.pageIndex);
        } finally {
            setLoading(false);
        }
    };

    return {
        createOrder,
        getOrdersByUser,
        fetchOrders,
        updateStatus,
        pagination,
        search,
        setSearch,
        loading
    };
}
