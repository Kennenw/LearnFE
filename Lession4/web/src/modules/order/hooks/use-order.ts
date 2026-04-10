import { useState } from "react";
import { OrderController } from "../controller/order-controller";
import { OrderCreateDTO } from "../dtos/order-dto";

export function useOrder() {
    const [loading, setLoading] = useState(false);

    const createOrder = async (payload: OrderCreateDTO) => {
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

    return {
        createOrder,
        getOrdersByUser,
        loading
    };
}
