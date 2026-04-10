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
            setError("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            await login(formData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || "Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.");
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Đăng nhập</h2>

                            {error && (
                                <div className="alert alert-danger">{error}</div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3 d-flex flex-column align-items-start">
                                    <label className="form-label">Tên đăng nhập</label>
                                    <input
                                        type="text"
                                        name="userName"
                                        className="form-control"
                                        value={formData.userName}
                                        onChange={handleChange}
                                        placeholder="Nhập tên đăng nhập"
                                        required
                                    />
                                </div>

                                <div className="mb-3 d-flex flex-column align-items-start">
                                    <label className="form-label">Mật khẩu</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Nhập mật khẩu"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Đang đăng nhập...
                                        </>
                                    ) : "Đăng nhập"}
                                </button>
                            </form>

                            <div className="text-center">
                                <p>
                                    Chưa có tài khoản?{" "}
                                    <Link to="/register" className="text-decoration-none">
                                        Đăng ký ngay
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}