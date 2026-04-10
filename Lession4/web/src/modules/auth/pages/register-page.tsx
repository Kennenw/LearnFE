import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { RegisterDTO } from "../dtos/auth-dto";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterDTO>({
        userName: "",
        password: ""
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

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

        if (formData.password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        if (formData.password.length < 2) {
            setError("Mật khẩu phải có ít nhất 2 ký tự!");
            return;
        }

        try {
            await register(formData);
            setSuccess(true);

            setTimeout(() => {
                navigate("/login");
            }, 2000);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || "Đăng ký thất bại! Vui lòng thử lại.");
        }
    };

    if (success) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="alert alert-success text-center">
                            <h4>Đăng ký thành công!</h4>
                            <p>Đang chuyển hướng đến trang đăng nhập...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Đăng ký tài khoản</h2>

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

                                <div className="mb-3 d-flex flex-column align-items-start">
                                    <label className="form-label ">Xác nhận mật khẩu</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Nhập lại mật khẩu"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success w-100 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Đang đăng ký...
                                        </>
                                    ) : "Đăng ký"}
                                </button>
                            </form>

                            <div className="text-center">
                                <p>
                                    Đã có tài khoản?{" "}
                                    <Link to="/login" className="text-decoration-none">
                                        Đăng nhập
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