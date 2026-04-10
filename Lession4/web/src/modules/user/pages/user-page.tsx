import { useState } from "react";
import { useUser } from "../hooks/use-user";
import CommonModal from "@core/ui/components/common-modal";
import CommonSelect from "@core/ui/components/common-select";
import type { UserViewDTO, UserCreateDTO } from "../dtos/user-dto";
import { Role, UserStatus } from "@core/enum/user";

export default function UserPage() {
    const {
        data,
        pagination,
        loading,
        search,
        setSearch,
        setPageIndex,
        createUser,
        updateUser,
        deleteUser,
        banUser,
        unBanUser,
        decentralieUser,
        reload,
    } = useUser();

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<UserViewDTO | null>(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBanModal, setShowBanModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);

    const [selectedUser, setSelectedUser] = useState<UserViewDTO | null>(null);
    const [newRole, setNewRole] = useState<Role>(Role.CUSTOMER);

    const [formData, setFormData] = useState({
        userName: "",
        password: "",
        role: Role.CUSTOMER as Role,
        status: UserStatus.ACTIVE as UserStatus,
    });

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({
            userName: "",
            password: "",
            role: Role.CUSTOMER,
            status: UserStatus.ACTIVE,
        });
        setShowModal(true);
    };

    const openEditModal = (user: UserViewDTO) => {
        setEditingUser(user);
        setFormData({
            userName: user.userName,
            password: "",
            role: user.role,
            status: user.status,
        });
        setShowModal(true);
    };

    const openDeleteConfirm = (user: UserViewDTO) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const openBanConfirm = (user: UserViewDTO) => {
        setSelectedUser(user);
        setShowBanModal(true);
    };

    const openRoleModal = (user: UserViewDTO) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setShowRoleModal(true);
    };

    const handleSave = async () => {
        if (!formData.userName.trim()) {
            alert("Vui lòng nhập tên đăng nhập!");
            return;
        }

        const payload: UserCreateDTO = {
            userName: formData.userName.trim(),
            password: formData.password,
            role: formData.role,
            status: formData.status,
        };

        try {
            if (editingUser) {
                await updateUser(editingUser.id, payload);
            } else {
                await createUser(payload);
            }
            setShowModal(false);
        } catch {
            alert("Có lỗi xảy ra khi lưu người dùng!");
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        await deleteUser(selectedUser.id);
        setShowDeleteModal(false);
    };

    const handleBan = async () => {
        if (!selectedUser) return;
        await banUser(selectedUser.id);
        setShowBanModal(false);
    };

    const handleUnBan = async (id: string) => {
        await unBanUser(id);
    };

    const handleChangeRole = async () => {
        if (!selectedUser || !newRole) return;
        await decentralieUser(selectedUser.id, newRole);
        setShowRoleModal(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const roleOptions = Object.values(Role).map(role => ({
        value: role,
        label: role
    }));

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Quản lý Người dùng (User)</h2>
                <button className="btn btn-success" onClick={openCreateModal}>
                    + Thêm người dùng mới
                </button>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm người dùng..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="col-md-6 text-end">
                    <button className="btn btn-outline-secondary" onClick={reload}>
                        ↻ Tải lại
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Tên đăng nhập</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th className="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && data.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-4">
                                    <div className="spinner-border text-primary" />
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-muted">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            data.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.userName}</td>
                                    <td>
                                        <span className="badge bg-primary">{user.role}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${user.status === UserStatus.ACTIVE ? "bg-success" : "bg-danger"}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => openEditModal(user)}
                                        >
                                            Sửa
                                        </button>

                                        <button
                                            className="btn btn-sm btn-info me-2"
                                            onClick={() => openRoleModal(user)}
                                        >
                                            Phân quyền
                                        </button>

                                        {user.status === UserStatus.ACTIVE ? (
                                            <button
                                                className="btn btn-sm btn-danger me-2"
                                                onClick={() => openBanConfirm(user)}
                                            >
                                                Cấm
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-sm btn-success me-2"
                                                onClick={() => handleUnBan(user.id)}
                                            >
                                                Bỏ cấm
                                            </button>
                                        )}

                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => openDeleteConfirm(user)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.totalPage > 1 && (
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${pagination.pageIndex === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setPageIndex(pagination.pageIndex - 1)}>
                                Trước
                            </button>
                        </li>
                        {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map(page => (
                            <li key={page} className={`page-item ${page === pagination.pageIndex ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setPageIndex(page)}>
                                    {page}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${pagination.pageIndex === pagination.totalPage ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setPageIndex(pagination.pageIndex + 1)}>
                                Sau
                            </button>
                        </li>
                    </ul>
                </nav>
            )}

            <CommonModal
                show={showModal}
                onHide={() => setShowModal(false)}
                title={editingUser ? "Sửa người dùng" : "Thêm người dùng mới"}
                onSave={handleSave}
                saveText={editingUser ? "Cập nhật" : "Tạo mới"}
                loading={loading}
                size="lg"
                backdrop="static"
            >
                <div className="mb-3 d-flex flex-column align-items-start">
                    <label className="form-label fw-bold">Tên đăng nhập <span className="text-danger">*</span></label>
                    <input
                        type="text"
                        name="userName"
                        className="form-control"
                        value={formData.userName}
                        onChange={handleInputChange}
                        placeholder="Nhập tên đăng nhập"
                        required
                    />
                </div>

                {!editingUser && (
                    <div className="mb-3 d-flex flex-column align-items-start">
                        <label className="form-label fw-bold">Mật khẩu <span className="text-danger">*</span></label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>
                )}
                <div className="d-flex gap-5">
                    <CommonSelect
                        label="Vai trò"
                        options={roleOptions}
                        value={formData.role}
                        onChange={(val) => setFormData(prev => ({ ...prev, role: val as Role }))}
                        placeholder="Chọn vai trò"
                    />

                    <div className="mb-3">
                        <label className="form-label fw-bold d-flex flex-column align-items-start">Trạng thái</label>
                        <select
                            name="status"
                            className="form-select"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value={UserStatus.ACTIVE}>Hoạt động</option>
                            <option value={UserStatus.BANNED}>Bị cấm</option>
                        </select>
                    </div>
                </div>
            </CommonModal>

            <CommonModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                title="Xác nhận xóa"
                onSave={handleDelete}
                saveText="Xóa"
                saveVariant="danger"
                loading={loading}
            >
                <p>Bạn có chắc muốn xóa người dùng <strong>{selectedUser?.userName}</strong>?</p>
            </CommonModal>

            <CommonModal
                show={showBanModal}
                onHide={() => setShowBanModal(false)}
                title="Cấm người dùng"
                onSave={handleBan}
                saveText="Cấm"
                saveVariant="danger"
                loading={loading}
            >
                <p>Bạn có chắc muốn cấm người dùng <strong>{selectedUser?.userName}</strong>?</p>
            </CommonModal>

            <CommonModal
                show={showRoleModal}
                onHide={() => setShowRoleModal(false)}
                title="Phân quyền người dùng"
                onSave={handleChangeRole}
                saveText="Cập nhật quyền"
                loading={loading}
            >
                <CommonSelect
                    label="Chọn vai trò mới"
                    options={roleOptions}
                    value={newRole}
                    onChange={(val) => setNewRole(val as Role)}
                />
            </CommonModal>
        </div>
    );
}