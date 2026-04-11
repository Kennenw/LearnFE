import './App.css';
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import BrandPage from "./modules/brand/pages/brand-page";
import CategoryPage from "@modules/category/pages/category-page";
import LoginPage from "@modules/auth/pages/login-page";
import RegisterPage from "@modules/auth/pages/register-page";

import { Role } from "@core/enum/user";
import { PrivateRoute } from '@modules/auth/pages/components/private-router';
import UserPage from '@modules/user/pages/user-page';
import ProductManagerPage from '@modules/product/pages/product-manager-page';
import ProductFormPage from '@modules/product/pages/product-form-page';
import ProductDetailPage from '@modules/product/pages/product-detail-page';
import ShopPage from '@modules/product/pages/shop-page';
import CartPage from '@modules/product/pages/cart-page';
import ProductCustomerDetailPage from '@modules/product/pages/product-customer-detail-page';
import OrderManagerPage from '@modules/order/pages/order-manager-page';
import UserOrderPage from '@modules/order/pages/user-order-page';
import { useCart } from '@modules/order/hooks/use-cart';

function CustomerNav({ userName, onLogout, cartCount }: { userName: string | null, onLogout: () => void, cartCount: number }) {
    return (
        <nav className="shop-nav sticky-top py-3">
            <div className="container d-flex align-items-center justify-content-between">
                <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
                    <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: "42px", height: "42px" }}>
                        <i className="bi bi- lightning-charge-fill fs-5"></i>
                    </div>
                    <span className="h4 fw-bold mb-0 text-dark" style={{ letterSpacing: '-0.8px' }}>ModernStore</span>
                </Link>

                <div className="d-flex align-items-center gap-4">
                    <Link to="/shop" className="text-decoration-none text-muted fw-bold small text-uppercase hover-primary">Shop</Link>
                    
                    <Link to="/cart" className="text-dark text-decoration-none position-relative p-2 bg-light rounded-pill px-3 d-flex align-items-center gap-2 border">
                        <i className="bi bi-bag"></i>
                        <span className="small fw-bold">Cart</span>
                        {cartCount > 0 && (
                            <span className="badge rounded-pill bg-primary" style={{ fontSize: '10px' }}>{cartCount}</span>
                        )}
                    </Link>

                    <div className="dropdown">
                        <button className="btn btn-modern btn-modern-outline dropdown-toggle py-2 border-0 shadow-sm" data-bs-toggle="dropdown">
                            <i className="bi bi-person-circle fs-5 me-1"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg p-2 mt-2" style={{ borderRadius: '15px', minWidth: '200px' }}>
                            <li><div className="px-3 py-2 small fw-bold text-muted text-uppercase" style={{ fontSize: '10px' }}>Authenticated as</div></li>
                            <li><div className="px-3 pb-2 fw-bold text-dark">{userName || 'Guest'}</div></li>
                            <li><hr className="dropdown-divider opacity-50" /></li>
                            <li><Link className="dropdown-item rounded-3 py-2 small" to="/my-orders"><i className="bi bi-bag me-2"></i>My Orders</Link></li>
                            <li><button className="dropdown-item rounded-3 py-2 small text-danger" onClick={onLogout}><i className="bi bi-box-arrow-right me-2"></i>Sign Out</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function Sidebar({ role, userName, onLogout }: { role: Role | null, userName: string | null, onLogout: () => void }) {
    const location = useLocation();
    return (
        <div className="sidebar shadow">
            <div className="sidebar-header">
                <Link to="/" className="text-decoration-none d-flex align-items-center gap-3">
                    <div className="bg-white text-primary rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: "36px", height: "36px" }}>
                        <i className="bi bi-lightning-charge-fill"></i>
                    </div>
                    <span className="h5 fw-bold mb-0 text-white">Console</span>
                </Link>
            </div>

            <div className="sidebar-menu">
                <span className="sidebar-label">Main Menu</span>
                <Link className={`sidebar-link ${location.pathname === '/' ? 'active' : ''}`} to="/">
                    <i className="bi bi-house-door"></i> Overview
                </Link>
                <Link className={`sidebar-link ${location.pathname.startsWith('/shop') ? 'active' : ''}`} to="/shop">
                    <i className="bi bi-cart3"></i> Storefront
                </Link>

                <span className="sidebar-label">Catalog & Stock</span>
                <Link className={`sidebar-link ${location.pathname.startsWith('/products') ? 'active' : ''}`} to="/products">
                    <i className="bi bi-box"></i> Products
                </Link>
                <Link className={`sidebar-link ${location.pathname === '/categories' ? 'active' : ''}`} to="/categories">
                    <i className="bi bi-tag"></i> Categories
                </Link>
                <Link className={`sidebar-link ${location.pathname === '/brands' ? 'active' : ''}`} to="/brands">
                    <i className="bi bi-patch-check"></i> Brands
                </Link>
                <Link className={`sidebar-link ${location.pathname.startsWith('/orders') ? 'active' : ''}`} to="/orders">
                    <i className="bi bi-cart-check"></i> Orders
                </Link>

                {role === Role.OWNER && (
                    <>
                        <span className="sidebar-label">Administration</span>
                        <Link className={`sidebar-link ${location.pathname === '/users' ? 'active' : ''}`} to="/users">
                            <i className="bi bi-shield-lock"></i> Staff Accounts
                        </Link>
                    </>
                )}
            </div>

            <div className="sidebar-footer">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-primary rounded-3 d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ width: "38px", height: "38px", fontSize: '12px' }}>
                        {userName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <div className="text-white small fw-bold text-truncate">{userName}</div>
                        <div className="text-muted" style={{ fontSize: '10px' }}>{role}</div>
                    </div>
                </div>
                <button className="btn btn-link text-white-50 text-decoration-none small p-0 hover-white w-100 text-start" onClick={onLogout}>
                    <i className="bi bi-box-arrow-left me-2"></i> Logout System
                </button>
            </div>
        </div>
    );
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("id"));
    const location = useLocation();
    const { totalCount } = useCart();

    useEffect(() => {
        const checkAuth = () => {
            setIsLoggedIn(!!localStorage.getItem("id"));
        };
        window.addEventListener("storage", checkAuth);
        checkAuth();
        return () => window.removeEventListener("storage", checkAuth);
    }, [location]);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        window.location.href = "/login";
    };

    const currentRole = localStorage.getItem("role") as Role | null;
    const currentUserName = localStorage.getItem("user-name");
    const isAdminMode = currentRole === Role.OWNER || currentRole === Role.STAFF;

    return (
        <div className="d-flex min-vh-100">
            {isLoggedIn && isAdminMode && (
                <Sidebar role={currentRole} userName={currentUserName} onLogout={handleLogout} />
            )}

            <div className="flex-grow-1 d-flex flex-column main-content overflow-auto">
                {(!isLoggedIn || !isAdminMode) && (
                    <CustomerNav userName={currentUserName} onLogout={handleLogout} cartCount={totalCount} />
                )}

                <div className={isAdminMode && isLoggedIn ? "p-4 p-lg-5" : "container flex-grow-1"}>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        <Route path="/" element={
                            <PrivateRoute>
                                {currentRole === Role.CUSTOMER ? <Navigate to="/shop" replace /> : (
                                    <div>
                                        <div className="mb-5 d-flex justify-content-between align-items-end">
                                            <div>
                                                <h2 className="fw-bold mb-1">Administrative Overview</h2>
                                                <p className="text-muted mb-0">Monitor your store performance and manage operations.</p>
                                            </div>
                                            <div className="bg-white shadow-sm border rounded-pill px-4 py-2 small fw-bold text-primary">
                                                <i className="bi bi-calendar3 me-2"></i> {new Date().toLocaleDateString()}
                                            </div>
                                        </div>
                                        
                                        <div className="row g-4 mb-5">
                                            {[
                                                { label: 'Total Stocked Items', value: '1,280', icon: 'bi-box-seam', color: '#6366f1' },
                                                { label: 'System Staff', value: '14', icon: 'bi-people', color: '#10b981' },
                                                { label: 'Active Collection', value: '24', icon: 'bi-bookmark-star', color: '#f59e0b' },
                                                { label: 'Recent Transactions', value: '482', icon: 'bi-lightning-charge', color: '#ef4444' }
                                            ].map((stat, idx) => (
                                                <div key={idx} className="col-12 col-md-6 col-lg-3">
                                                    <div className="card-modern shadow-sm h-100 border-0">
                                                        <div className="d-flex align-items-center gap-3 mb-3">
                                                            <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px', background: `${stat.color}10`, color: stat.color }}>
                                                                <i className={`bi ${stat.icon} fs-5`}></i>
                                                            </div>
                                                            <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.8px', fontSize: '10px' }}>{stat.label}</span>
                                                        </div>
                                                        <h3 className="fw-bold mb-0 text-dark">{stat.value}</h3>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="card-modern p-5 text-center border-0 shadow-sm bg-white" style={{ borderRadius: '24px' }}>
                                            <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '90px', height: '90px' }}>
                                                <i className="bi bi-graph-up-arrow display-6"></i>
                                            </div>
                                            <h3 className="fw-bold">Ready for Operations</h3>
                                            <p className="text-muted mx-auto" style={{ maxWidth: '450px' }}>Select an option from the sidebar to manage your category, products and system inventory settings.</p>
                                        </div>
                                    </div>
                                )}
                            </PrivateRoute>
                        } />

                        {/* Routes... */}
                        <Route path="/shop" element={<PrivateRoute><ShopPage /></PrivateRoute>} />
                        <Route path="/shop/product/:id" element={<PrivateRoute><ProductCustomerDetailPage /></PrivateRoute>} />
                        <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
                        <Route path="/my-orders" element={<PrivateRoute><UserOrderPage /></PrivateRoute>} />
                        
                        <Route path="/users" element={<PrivateRoute allowedRoles={[Role.OWNER]}><UserPage /></PrivateRoute>} />
                        <Route path="/brands" element={<PrivateRoute allowedRoles={[Role.OWNER, Role.STAFF]}><BrandPage /></PrivateRoute>} />
                        <Route path="/categories" element={<PrivateRoute allowedRoles={[Role.OWNER, Role.STAFF]}><CategoryPage /></PrivateRoute>} />
                        <Route path="/products" element={<PrivateRoute allowedRoles={[Role.OWNER, Role.STAFF]}><ProductManagerPage /></PrivateRoute>} />
                        <Route path="/products/create" element={<PrivateRoute allowedRoles={[Role.OWNER, Role.STAFF]}><ProductFormPage /></PrivateRoute>} />
                        <Route path="/products/edit/:id" element={<PrivateRoute allowedRoles={[Role.OWNER, Role.STAFF]}><ProductFormPage /></PrivateRoute>} />
                        <Route path="/products/:id" element={<PrivateRoute allowedRoles={[Role.OWNER, Role.STAFF]}><ProductDetailPage /></PrivateRoute>} />
                        <Route path="/orders" element={<PrivateRoute allowedRoles={[Role.OWNER, Role.STAFF]}><OrderManagerPage /></PrivateRoute>} />

                        <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
                    </Routes>
                </div>
            </div>
            <style>{`
                .hover-white:hover { color: white !important; }
                .hover-primary:hover { color: var(--primary) !important; }
            `}</style>
        </div>
    );
}

export default App;