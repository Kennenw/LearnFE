import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { LoginDTO } from "../dtos/auth-dto";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const { login, loading, status } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<LoginDTO>({
        userName: "",
        password: ""
    });

    const [error, setError] = useState("");

    if (status) {
        navigate("/"); 
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!formData.userName || !formData.password) {
            setError("Please fill in all fields!");
            return;
        }
        try {
            await login(formData);
        } catch (err: any) {
            setError(err.message || "Login failed! Please check your credentials.");
        }
    };

    return (
        <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="col-11 col-sm-8 col-md-6 col-lg-4 col-xl-3">
                <div className="text-center mb-4">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "60px", height: "60px" }}>
                        <i className="bi bi-cart-fill fs-3"></i>
                    </div>
                    <h2 className="fw-bold">ModernStore</h2>
                    <p className="text-muted">Welcome back! Please login to continue.</p>
                </div>

                <div className="card-modern shadow-lg p-4 border-0">
                    {error && (
                        <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25 text-danger small py-2">
                            <i className="bi bi-exclamation-circle me-2"></i>{error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-muted text-uppercase mb-2">Username</label>
                            <input
                                type="text"
                                name="userName"
                                className="form-control form-control-modern"
                                value={formData.userName}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-muted text-uppercase mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control form-control-modern"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-modern btn-modern-primary w-100 justify-content-center py-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Authenticating...
                                </>
                            ) : "Sign In"}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-muted small mb-0">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-primary fw-bold text-decoration-none hover-underline">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="text-center mt-5">
                    <Link to="/shop" className="text-muted small text-decoration-none">
                        <i className="bi bi-arrow-left me-1"></i> Back to shop
                    </Link>
                </div>
            </div>
        </div>
    );
}