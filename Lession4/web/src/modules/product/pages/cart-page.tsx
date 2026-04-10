import { useCart } from "@modules/order/hooks/use-cart";
import { useOrder } from "@modules/order/hooks/use-order";
import { OrderStatus } from "@core/enum/order";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CartPage() {
    const { cartItems, totalCount, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
    const { createOrder, loading: orderLoading } = useOrder();
    const navigate = useNavigate();
    const [address, setAddress] = useState("");

    const handleCheckout = async () => {
        if (cartItems.length === 0 || !address.trim()) return;
        const userId = localStorage.getItem("id");
        if (!userId) return;

        try {
            await createOrder({
                customerId: userId,
                orderDate: new Date(),
                status: OrderStatus.PENDING,
                totalAmount: totalCount,
                totalPrice: totalPrice,
                shippingAddress: address.trim()
            });
            alert("Order placed!");
            clearCart();
            navigate("/");
        } catch { alert("Checkout failed."); }
    };

    return (
        <div className="container py-5">
            <header className="mb-5">
                <h1 className="fw-bold mb-2">My Bag</h1>
                <p className="text-muted">Review your selected items and complete your purchase.</p>
            </header>

            {cartItems.length === 0 ? (
                <div className="text-center py-5 card-modern border-0 mt-4 shadow-sm">
                    <i className="bi bi-cart-x display-1 text-muted opacity-25"></i>
                    <h3 className="mt-4 fw-bold">Your bag is empty</h3>
                    <p className="text-muted">Start adding items from our collection.</p>
                    <Link to="/shop" className="btn btn-modern btn-modern-primary mt-4 px-5">Explore Shop</Link>
                </div>
            ) : (
                <div className="row g-5">
                    <div className="col-lg-8">
                        <div className="card-modern border-0 shadow-sm p-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="row g-4 py-4 border-bottom last-child-no-border">
                                    <div className="col-4 col-md-3 col-lg-2">
                                        <div className="bg-light rounded-4 d-flex align-items-center justify-content-center ratio ratio-1x1 overflow-hidden">
                                            <i className="bi bi-image text-muted opacity-25 fs-2"></i>
                                        </div>
                                    </div>
                                    <div className="col-8 col-md-9 col-lg-10">
                                        <div className="d-flex flex-column h-100">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <h5 className="fw-bold mb-1">{item.productName}</h5>
                                                    <p className="small text-muted mb-3 font-monospace">{item.color} • {item.size}</p>
                                                </div>
                                                <div className="text-end">
                                                    <div className="fw-bold h5 mb-0">{(item.price * item.quantity).toLocaleString()} đ</div>
                                                    <div className="text-muted small" style={{ fontSize: '12px' }}>{item.price.toLocaleString()} đ / unit</div>
                                                </div>
                                            </div>
                                            <div className="mt-auto d-flex align-items-center justify-content-between pt-3">
                                                <div className="d-flex align-items-center gap-1 bg-light rounded-pill p-1 border">
                                                    <button className="btn btn-icon-small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                                    <input type="text" className="form-control-minimal" value={item.quantity} readOnly />
                                                    <button className="btn btn-icon-small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                                </div>
                                                <button className="btn btn-link text-danger text-decoration-none small fw-bold" onClick={() => removeItem(item.id)}>Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card-modern border-0 shadow-sm p-4 sticky-top" style={{ top: '100px' }}>
                            <h5 className="fw-bold mb-4">Summary</h5>
                            <div className="d-flex justify-content-between mb-3 text-muted">
                                <span>Subtotal</span>
                                <span>{totalPrice.toLocaleString()} đ</span>
                            </div>
                            <div className="d-flex justify-content-between mb-4 pb-4 border-bottom text-muted">
                                <span>Shipping</span>
                                <span className="text-success fw-bold">Complimentary</span>
                            </div>
                            <div className="d-flex justify-content-between mb-5">
                                <span className="h5 fw-bold mb-0">Total Price</span>
                                <span className="h4 fw-bold text-primary mb-0">{totalPrice.toLocaleString()} đ</span>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted text-uppercase mb-2">Delivery Details</label>
                                <textarea className="form-control form-input-modern" rows={3} placeholder="Full address and contact..." value={address} onChange={(e) => setAddress(e.target.value)} required />
                            </div>

                            <button className="btn btn-modern btn-modern-primary w-100 py-3 shadow-lg" onClick={handleCheckout} disabled={orderLoading}>
                                {orderLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-lock-fill me-2"></i>}
                                Secure Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .last-child-no-border:last-child { border-bottom: none !important; }
                .btn-icon-small { border-radius: 50%; border: none; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; background: transparent; }
                .btn-icon-small:hover { background: rgba(0,0,0,0.05); }
                .form-control-minimal { border: none; background: transparent; width: 40px; text-align: center; font-weight: bold; font-size: 14px; shadow: none; outline: none; }
            `}</style>
        </div>
    );
}
