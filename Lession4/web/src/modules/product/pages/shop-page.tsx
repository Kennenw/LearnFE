import { useProduct } from "../hooks/use-product";
import { ProductStatus } from "@core/enum/product";
import { Link } from "react-router-dom";
import { useCart } from "@modules/order/hooks/use-cart";
import { useState } from "react";

export default function ShopPage() {
    const {
        data: products,
        loading: productsLoading,
        search,
        setSearch
    } = useProduct();
    const { addToCart } = useCart();
    const [addingId, setAddingId] = useState<string | null>(null);

    const activeProducts = products.filter(p => p.status === ProductStatus.ACTIVE);

    const handleQuickAddToCart = async (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();

        setAddingId(product.id);

        try {
            window.location.href = `/shop/product/${product.id}`;
        } finally {
            setTimeout(() => setAddingId(null), 500);
        }
    };

    return (
        <div className="pb-5 container">
            <header className="mb-5 d-flex flex-column align-items-center text-center mt-5">
                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3 small fw-bold">Premium Selection</span>
                <h1 className="display-5 fw-bold mb-3" style={{ letterSpacing: '-1.5px' }}>Discover Quality Products</h1>
                <p className="text-muted mb-5 mx-auto" style={{ maxWidth: '600px' }}>Our curated collection brings you the best in design and performance.</p>

                <div className="col-md-7 mx-auto">
                    <div className="input-group card-modern rounded-pill overflow-hidden border-0 shadow-lg ps-4 p-1">
                        <span className="input-group-text bg-white border-0 ps-3">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-0 shadow-none py-2 px-3"
                            placeholder="Find your next favorite item..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-modern btn-modern-primary rounded-pill px-5 fw-bold m-1">Search</button>
                    </div>
                </div>
            </header>

            {productsLoading && activeProducts.length === 0 ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-3 text-muted">Loading collection...</p>
                </div>
            ) : activeProducts.length === 0 ? (
                <div className="text-center py-5 card-modern border-0 bg-white">
                    <i className="bi bi-search display-3 text-muted opacity-25"></i>
                    <h5 className="fw-bold mt-4">No results found</h5>
                    <p className="text-muted">Try a different keyword or check your spelling.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {activeProducts.map((product) => (
                        <div key={product.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                            <Link to={`/shop/product/${product.id}`} className="text-decoration-none text-dark h-100">
                                <div className="card-modern h-100 p-3 d-flex flex-column border-0">
                                    <div className="bg-light rounded-4 d-flex align-items-center justify-content-center mb-4 transition-all overflow-hidden" style={{ height: "240px" }}>
                                        <i className="bi bi-bag-plus text-muted opacity-10" style={{ fontSize: '4rem' }}></i>
                                    </div>
                                    <div className="d-flex flex-column flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="small text-primary fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '10px' }}>{product.categoryName}</span>
                                            <span className="small text-muted">{product.brandName}</span>
                                        </div>
                                        <h6 className="fw-bold mb-3 line-clamp-2" style={{ lineHeight: '1.4', fontSize: '1.1rem' }}>{product.name}</h6>

                                        <div className="mt-auto pt-3 d-flex align-items-center justify-content-between border-top">
                                            <div className="fw-bold fs-5 text-dark">Price Tag</div>
                                            <button
                                                className="btn btn-modern btn-modern-outline btn-sm py-2 px-3 rounded-pill"
                                                onClick={(e) => handleQuickAddToCart(e, product)}
                                            >
                                                {addingId === product.id ? <span className="spinner-border spinner-border-sm"></span> : <><i className="bi bi-cart-plus me-1"></i> Add</>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
