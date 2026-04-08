import OrderDetail from "../models/order-detail";

export interface OrderDetailViewDTO {
    id: string;
    orderId: string;
    productVariantId: string;
    quantity: number;
    price: number;
}

export interface OrderDetailCreateDTO {
    orderId: string;
    productVariantId: string;
    quantity: number;
    price: number;
}

export interface OrderDetailUpdateDTO extends Partial<Omit<OrderDetail, 'id'>> {

}