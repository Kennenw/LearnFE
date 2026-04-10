import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { RegisterDTO } from "../dtos/auth-dto";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const { register, loading, status } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterDTO>({
        userName: "",
        password: "",
        confirmPassword: ""
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
        if (!formData.userName || !formData.password || !formData.confirmPassword) {
            setError("All fields are required!");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        try {
            await register(formData);
        } catch (err: any) {
            setError(err.message || "Registration failed!");
        }
    };

    return (
        <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-4">
                <div className="text-center mb-4">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "60px", height: "60px" }}>
                        <i className="bi bi-person-plus-fill fs-3"></i>
                    </div>
                    <h2 className="fw-bold">Create Account</h2>
                    <p className="text-muted">Join ModernStore and start shopping today.</p>
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
                                placeholder="Choose a username"
                                required
                            />
                        </div>

                        <div className="row mb-4">
                            <div className="col-6">
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
                            <div className="col-6">
                                <label className="form-label small fw-bold text-muted text-uppercase mb-2">Confirm</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-control form-control-modern"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-modern btn-modern-primary w-100 justify-content-center py-2 shadow-sm"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Creating account...
                                </>
                            ) : "Register Now"}
                        </button>
                    </form>

                    <div className="text-center mt-4 pt-2 border-top">
                        <p className="text-muted small mb-0">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary fw-bold text-decoration-none">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}