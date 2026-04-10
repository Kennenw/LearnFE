import { useParams, useNavigate, Link } from "react-router-dom";
import { useProduct } from "../hooks/use-product";
import { useEffect, useState } from "react";
import { useCart } from "@modules/order/hooks/use-cart";

export default function ProductCustomerDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { fetchProductDetail, productDetail, loading } = useProduct();
    const { addToCart } = useCart();
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        if (id) fetchProductDetail(id);
    }, [id, fetchProductDetail]);

    useEffect(() => {
        if (productDetail && productDetail.variants.length > 0) {
            setSelectedVariant(productDetail.variants[0]);
        }
    }, [productDetail]);

    if (loading && !productDetail) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;
    if (!productDetail) return <div className="container py-5 text-center"><h3>Product not found</h3></div>;

    const { product, variants } = productDetail;

    return (
        <div className="container py-5 mt-4">
            <div className="row g-5">
                <div className="col-md-6">
                    <div className="card-modern border-0 shadow-sm rounded-5 overflow-hidden p-2 bg-white sticky-top" style={{ top: '100px' }}>
                        <div className="bg-light rounded-5 d-flex align-items-center justify-content-center ratio ratio-1x1 mb-0 border">
                            <i className="bi bi-box-seam text-muted opacity-10 display-1"></i>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="ps-md-4">
                        <nav aria-label="breadcrumb" className="mb-2">
                            <ol className="breadcrumb small m-0">
                                <li className="breadcrumb-item"><Link to="/shop" className="text-decoration-none text-muted">Shop</Link></li>
                                <li className="breadcrumb-item active fw-bold text-primary">{product.categoryName}</li>
                            </ol>
                        </nav>

                        <h1 className="fw-bold mb-1 display-6" style={{ letterSpacing: '-1.2px' }}>{product.name}</h1>
                        <p className="text-muted small mb-4">{product.brandName}</p>

                        <div className="mb-4 d-flex align-items-center gap-3">
                            <h2 className="fw-black text-primary mb-0">{selectedVariant?.price.toLocaleString() ?? "0"} đ</h2>
                            <span className="badge bg-success bg-opacity-10 text-success py-1 px-3 rounded-pill tiny-label">In Stock</span>
                        </div>

                        <div className="mb-5 border-top pt-4">
                            <label className="sidebar-label m-0 p-0 mb-3" style={{ fontSize: '11px', color: '#94a3b8' }}>Configurations</label>
                            <div className="d-flex flex-wrap gap-2">
                                {variants.map((v: any) => (
                                    <button
                                        key={v.id}
                                        className={`btn-modern py-1 px-3 ${selectedVariant?.id === v.id ? 'btn-modern-primary border-primary' : 'btn-modern-outline'} border small`}
                                        style={{ fontSize: '12px', borderRadius: '10px' }}
                                        onClick={() => setSelectedVariant(v)}
                                    >
                                        {v.color} / {v.size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="d-inline-flex align-items-center gap-2 mb-5">
                            <div className="d-flex align-items-center bg-light rounded-2 border" style={{ height: '42px', overflow: 'hidden' }}>
                                <button className="btn btn-sm px-3 border-0 h-100 hover-bg-dark" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <input type="text" className="form-control border-0 bg-transparent text-center p-0 fw-bold small" style={{ width: '40px' }} value={quantity} readOnly />
                                <button className="btn btn-sm px-3 border-0 h-100 hover-bg-dark" onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                            <button className="btn btn-modern btn-modern-primary py-0 px-4 shadow-sm fw-bold" style={{ height: '42px', borderRadius: '8px', fontSize: '13.5px' }} onClick={() => {
                                if (!selectedVariant) return;
                                addToCart({ productId: product.id, productName: product.name, variantId: selectedVariant.id, color: selectedVariant.color, size: selectedVariant.size, price: selectedVariant.price, quantity });
                                alert("Added!");
                            }}>
                                <i className="bi bi-cart-plus me-2"></i> Add to Cart
                            </button>
                        </div>

                        <div className="mt-4 pt-4 border-top">
                            <div className="d-flex gap-4 mb-3">
                                <button className={`btn p-0 pb-2 border-0 rounded-0 tiny-label fw-bold text-uppercase ${activeTab === 'description' ? 'border-primary border-bottom-2 text-primary' : 'text-muted'}`} style={{ borderBottom: activeTab === 'description' ? '2px solid' : '' }} onClick={() => setActiveTab('description')}>Description</button>
                                <button className={`btn p-0 pb-2 border-0 rounded-0 tiny-label fw-bold text-uppercase ${activeTab === 'specs' ? 'border-primary border-bottom-2 text-primary' : 'text-muted'}`} style={{ borderBottom: activeTab === 'specs' ? '2px solid' : '' }} onClick={() => setActiveTab('specs')}>Specs</button>
                            </div>
                            <div className="small text-muted" style={{ lineHeight: '1.6', fontSize: '13.5px' }}>
                                {activeTab === 'description' ? (
                                    <p className="m-0" style={{ whiteSpace: 'pre-line' }}>{product.description || "Premium experience."}</p>
                                ) : (
                                    <div className="d-flex flex-column gap-2">
                                        <div className="d-flex justify-content-between"><span>Merchant</span><span className="text-dark fw-bold">{product.brandName}</span></div>
                                        <div className="d-flex justify-content-between"><span>Category</span><span className="text-dark fw-bold">{product.categoryName}</span></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .breadcrumb-item + .breadcrumb-item::before { content: "•"; color: #cbd5e1; }
                .fw-black { font-weight: 900; }
                .tiny-label { font-size: 10px; letter-spacing: 0.5px; }
                .hover-bg-dark:hover { background: rgba(0,0,0,0.05); }
            `}</style>
        </div>
    );
}
