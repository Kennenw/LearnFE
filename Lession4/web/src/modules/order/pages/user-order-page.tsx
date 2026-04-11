import { useEffect, useState } from "react";
import { useOrder } from "../hooks/use-order";
import { OrderStatus } from "@core/enum/order";
import { OrderApplicationViewDTO } from "../dtos/order-application-dto";

export default function UserOrderPage() {
    const { getOrdersByUser, loading } = useOrder();
    const [orders, setOrders] = useState<OrderApplicationViewDTO[]>([]);

    useEffect(() => {
        const userId = localStorage.getItem("id");
        if (userId) {
            getOrdersByUser(userId).then(res => {
                setOrders(res.data);
            });
        }
    }, []);

    const getStatusBadgeClass = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING: return "bg-warning text-dark";
            case OrderStatus.CONFIRMED: return "bg-info text-white";
            case OrderStatus.SHIPPING: return "bg-primary text-white";
            case OrderStatus.COMPLETED: return "bg-success text-white";
            case OrderStatus.CANCELLED: return "bg-danger text-white";
            default: return "bg-secondary text-white";
        }
    };

    return (
        <div className="container py-5">
            <header className="mb-5">
                <h1 className="fw-bold mb-2">My Purchase History</h1>
                <p className="text-muted">Track your recent orders and delivery status.</p>
            </header>

            {loading && orders.length === 0 ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-5 card-modern border-0 mt-4 shadow-sm">
                    <i className="bi bi-clock-history display-1 text-muted opacity-25"></i>
                    <h3 className="mt-4 fw-bold">No orders yet</h3>
                    <p className="text-muted">Your purchase history will appear here once you place an order.</p>
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {orders.map((item) => (
                        <div key={item.order.id} className="card-modern border-0 shadow-sm overflow-hidden">
                            <div className="p-4 bg-light border-bottom d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="small text-muted text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '1px' }}>Order Placed</span>
                                    <div className="fw-bold">{new Date(item.order.orderDate).toLocaleDateString()}</div>
                                </div>
                                <div className="text-end">
                                    <span className="small text-muted text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '1px' }}>Total Amount</span>
                                    <div className="fw-bold text-primary">${item.order.totalPrice.toLocaleString()}</div>
                                </div>
                                <div>
                                    <span className={`badge rounded-pill px-3 py-1 fw-bold ${getStatusBadgeClass(item.order.status)}`}>
                                        {item.order.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="mb-3 small">
                                    <span className="text-muted fw-bold me-2">Ship to:</span>
                                    <span className="text-dark">{item.order.shippingAddress}</span>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-borderless table-sm mb-0">
                                        <thead>
                                            <tr className="text-muted small text-uppercase">
                                                <th>Product</th>
                                                <th className="text-center">Quantity</th>
                                                <th className="text-end">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.details.map((detail) => (
                                                <tr key={detail.id}>
                                                    <td className="py-2">
                                                        <div className="fw-bold text-dark">Item #{detail.productVariantId.substring(0,8)}</div>
                                                    </td>
                                                    <td className="text-center py-2">x{detail.quantity}</td>
                                                    <td className="text-end py-2">${detail.price.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
