import { useEffect } from "react";
import { useOrder } from "../hooks/use-order";
import { OrderStatus } from "@core/enum/order";

export default function OrderManagerPage() {
    const { 
        pagination, 
        fetchOrders, 
        updateStatus, 
        loading, 
        search, 
        setSearch 
    } = useOrder();

    useEffect(() => {
        fetchOrders(1);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchOrders(1);
    };

    const orders = pagination?.data || [];

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
        <div className="container-fluid px-0">
            <header className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold mb-1">Order Fulfillment</h2>
                    <p className="text-muted small mb-0">Manage customer orders and coordinate shipping logistics.</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-modern btn-modern-outline" onClick={() => fetchOrders(pagination?.pageIndex)}>
                        <i className={`bi bi-arrow-clockwise ${loading ? 'spinner-border spinner-border-sm border-0' : ''}`}></i>
                    </button>
                </div>
            </header>

            <div className="card-modern border-0 shadow-sm overflow-hidden mt-4">
                <div className="p-4 bg-white border-bottom">
                    <form onSubmit={handleSearch} className="col-md-5">
                        <div className="input-group overflow-hidden border rounded-3 bg-light bg-opacity-50 ps-3">
                            <span className="input-group-text bg-transparent border-0 pe-1 text-muted"><i className="bi bi-search"></i></span>
                            <input 
                                type="text" 
                                className="form-control border-0 bg-transparent shadow-none py-2" 
                                placeholder="Search by address..." 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)} 
                            />
                        </div>
                    </form>
                </div>

                <div className="table-responsive">
                    <table className="table table-modern mb-0">
                        <thead>
                            <tr>
                                <th className="px-4">Order ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Shipping Address</th>
                                <th className="text-center">Controls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-5 text-muted">No orders found.</td>
                                </tr>
                            ) : orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-4 fw-bold text-primary small">#{order.id.substring(0, 8).toUpperCase()}</td>
                                    <td>{new Date(order.orderDate).toLocaleString()}</td>
                                    <td className="fw-bold">${order.totalPrice.toLocaleString()}</td>
                                    <td>
                                        <span className={`badge rounded-pill px-3 py-1 small fw-bold ${getStatusBadgeClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="small text-muted line-clamp-1" style={{ maxWidth: '200px' }}>
                                            {order.shippingAddress}
                                        </div>
                                    </td>
                                    <td className="text-end px-4 text-nowrap">
                                        {order.status === OrderStatus.PENDING && (
                                            <button 
                                                className="btn btn-sm btn-outline-info rounded-pill px-3 me-2"
                                                onClick={() => updateStatus(order.id, OrderStatus.CONFIRMED)}
                                                disabled={loading}
                                            >Confirm</button>
                                        )}
                                        {order.status === OrderStatus.CONFIRMED && (
                                            <button 
                                                className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2"
                                                onClick={() => updateStatus(order.id, OrderStatus.SHIPPING)}
                                                disabled={loading}
                                            >Start Shipping</button>
                                        )}
                                        {order.status === OrderStatus.SHIPPING && (
                                            <button 
                                                className="btn btn-sm btn-success rounded-pill px-3 me-2"
                                                onClick={() => updateStatus(order.id, OrderStatus.COMPLETED)}
                                                disabled={loading}
                                            >Shipper: Delivered</button>
                                        )}
                                        {order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.CANCELLED && (
                                            <button 
                                                className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                                onClick={() => updateStatus(order.id, OrderStatus.CANCELLED)}
                                                disabled={loading}
                                            >Cancel</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {pagination && pagination.totalPage > 1 && (
                    <div className="p-4 border-top d-flex justify-content-between align-items-center bg-light bg-opacity-10">
                        <span className="small text-muted fw-bold">Page {pagination.pageIndex} of {pagination.totalPage}</span>
                        <div className="d-flex gap-2">
                             <button 
                                className="btn btn-modern btn-modern-outline btn-sm py-1 px-3" 
                                disabled={pagination.pageIndex === 1 || loading} 
                                onClick={() => fetchOrders(pagination.pageIndex - 1)}
                            ><i className="bi bi-chevron-left"></i></button>
                             <button 
                                className="btn btn-modern btn-modern-outline btn-sm py-1 px-3" 
                                disabled={pagination.pageIndex === pagination.totalPage || loading} 
                                onClick={() => fetchOrders(pagination.pageIndex + 1)}
                            ><i className="bi bi-chevron-right"></i></button>
                        </div>
                    </div>
                )}
            </div>
            <style>{` .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; } `}</style>
        </div>
    );
}
