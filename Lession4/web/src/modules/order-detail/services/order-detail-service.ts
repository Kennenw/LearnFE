import { PaginationResult } from "@core/types/common";
import { OrderDetailViewDTO, OrderDetailCreateDTO, OrderDetailUpdateDTO } from "../dtos/order-detail-dto";
import IOrderDetailService from "./iorder-detail-service";
import IGenericRepository from "@core/interfaces/igeneric-repository";
import OrderDetail from "../models/order-detail";
import { Pagination } from "@core/utils/pagination";

export default class OrderDetailService implements IOrderDetailService {
    private orderDetailRepo: IGenericRepository<OrderDetail>;

    constructor(orderDetailRepo: IGenericRepository<OrderDetail>) {
        this.orderDetailRepo = orderDetailRepo;
    }

    async getByOrderIdAsync(id: string): Promise<PaginationResult<OrderDetailViewDTO>> {
        const details = await this.orderDetailRepo.getAsync(undefined, undefined, queryDB => {
            return queryDB.select('*').eq('orderId', id);
        });
        return Pagination(details.data, details.count);
    }

    async addAsync(value: OrderDetailCreateDTO): Promise<string> {
        await this.orderDetailRepo.addAsync(value as OrderDetail);
        return "Tạo chi tiết đơn hàng thành công";
    }

    async updateAsync(id: string, value: OrderDetailUpdateDTO): Promise<string> {
        await this.orderDetailRepo.editAsync(id, value);
        return "Cập nhật thành công";
    }

    async removeAsync(id: string): Promise<string> {
        await this.orderDetailRepo.removeAsync(id);
        return "Xóa thành công";
    }
}