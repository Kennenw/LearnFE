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

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("id"));
    const location = useLocation();

    useEffect(() => {
        const checkAuth = () => {
            setIsLoggedIn(!!localStorage.getItem("id"));
        };

        window.addEventListener("storage", checkAuth);
        checkAuth();

        return () => window.removeEventListener("storage", checkAuth);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("id");
        localStorage.removeItem("user-name");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        window.location.href = "/login";
    };

    const currentRole = localStorage.getItem("role") as Role | null;
    const currentUserName = localStorage.getItem("user-name");

    return (
        <div className="d-flex">
            {isLoggedIn && (
                <div className="bg-dark text-white vh-100 p-3" style={{ width: "260px" }}>
                    <div className="text-center mb-4">
                        <h5 className="mb-1">{currentUserName}-{currentRole}</h5>
                    </div>

                    <ul className="nav flex-column">
                        <li className="nav-item mb-2">
                            <Link className="nav-link text-white" to="/">Dashboard</Link>
                        </li>

                        {(currentRole === Role.OWNER || currentRole === Role.STAFF) && (
                            <>
                                {(currentRole === Role.OWNER) && (
                                    <li className="nav-item mb-2">
                                        <Link className="nav-link text-white" to="/users">User</Link>
                                    </li>
                                )}
                                <li className="nav-item mb-2">
                                    <Link className="nav-link text-white" to="/brands">Brand</Link>
                                </li>
                                <li className="nav-item mb-2">
                                    <Link className="nav-link text-white" to="/categories">Category</Link>
                                </li>
                                <li className="nav-item mb-2">
                                    <Link className="nav-link text-white" to="/products">Product</Link>
                                </li>
                            </>
                        )}

                    </ul>

                    <div className="mt-auto pt-4 border-top">
                        <div className="small mb-1">
                            <strong>{currentUserName}</strong>
                        </div>
                        <div className="small text-muted mb-3">
                            {currentRole}
                        </div>
                        <button
                            className="btn btn-outline-danger w-100 btn-sm"
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            )}

            <div className={`flex-grow-1 p-4 ${isLoggedIn ? "" : "vh-100"}`}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <h2>Welcome to Dashboard</h2>
                                <p>Chào mừng bạn đến với trang quản trị!</p>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/users"
                        element={
                            <PrivateRoute allowedRoles={[Role.OWNER]}>
                                <UserPage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/brands"
                        element={
                            <PrivateRoute allowedRoles={[Role.OWNER, Role.STAFF]}>
                                <BrandPage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/categories"
                        element={
                            <PrivateRoute allowedRoles={[Role.OWNER, Role.STAFF]}>
                                <CategoryPage />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/products"
                        element={
                            <PrivateRoute allowedRoles={[Role.OWNER, Role.STAFF]}>
                                <ProductManagerPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/products/create"
                        element={
                            <PrivateRoute allowedRoles={[Role.OWNER, Role.STAFF]}>
                                <ProductFormPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/products/edit/:id"
                        element={
                            <PrivateRoute allowedRoles={[Role.OWNER, Role.STAFF]}>
                                <ProductFormPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/products/:id"
                        element={
                            <PrivateRoute allowedRoles={[Role.OWNER, Role.STAFF]}>
                                <ProductDetailPage />
                            </PrivateRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;