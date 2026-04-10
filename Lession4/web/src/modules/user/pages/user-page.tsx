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
        decentralieUser,
        reload,
    } = useUser();

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<UserViewDTO | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
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
        setFormData({ userName: "", password: "", role: Role.CUSTOMER, status: UserStatus.ACTIVE });
        setShowModal(true);
    };

    const openEditModal = (user: UserViewDTO) => {
        setEditingUser(user);
        setFormData({ userName: user.userName, password: "", role: user.role, status: user.status });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.userName.trim()) return;
        const payload: UserCreateDTO = {
            userName: formData.userName.trim(),
            password: formData.password,
            role: formData.role,
            status: formData.status,
        };
        try {
            if (editingUser) await updateUser(editingUser.id, payload);
            else await createUser(payload);
            setShowModal(false);
        } catch { alert("Action failed!"); }
    };

    const roleOptions = Object.values(Role).map(role => ({ value: role, label: role }));

    const getRoleBadgeClass = (role: Role) => {
        switch(role) {
            case Role.OWNER: return 'badge-role-owner';
            case Role.STAFF: return 'badge-role-staff';
            case Role.CUSTOMER: return 'badge-role-customer';
            default: return 'bg-light text-dark';
        }
    };

    return (
        <div className="container-fluid px-0">
            <header className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold mb-1">User Management</h2>
                    <p className="text-muted small mb-0">Oversee system accounts and operational roles</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-modern btn-modern-outline" onClick={reload}><i className="bi bi-arrow-clockwise"></i></button>
                    <button className="btn btn-modern btn-modern-primary px-4" onClick={openCreateModal}>
                        <i className="bi bi-person-plus me-2"></i> Register New
                    </button>
                </div>
            </header>

            <div className="card-modern border-0 shadow-sm overflow-hidden">
                <div className="p-4 bg-white border-bottom">
                    <div className="col-md-5">
                        <div className="input-group overflow-hidden border rounded-3 bg-light bg-opacity-50 ps-3">
                            <span className="input-group-text bg-transparent border-0 pe-1 text-muted"><i className="bi bi-search"></i></span>
                            <input type="text" className="form-control border-0 bg-transparent shadow-none py-2" placeholder="Search accounts..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-modern mb-0">
                        <thead>
                            <tr>
                                <th className="px-4">Account Name</th>
                                <th>Operational Role</th>
                                <th>Status</th>
                                <th className="text-center">Controls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-4 fw-bold text-dark">{user.userName}</td>
                                    <td>
                                        <span className={`badge-role ${getRoleBadgeClass(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge rounded-pill px-3 py-1 ${user.status === UserStatus.ACTIVE ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'} small fw-bold`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <button className="btn btn-link text-decoration-none small fw-bold me-2" onClick={() => openEditModal(user)}>Edit</button>
                                        <button className="btn btn-link text-decoration-none small text-muted fw-bold me-2" onClick={() => {setSelectedUser(user); setNewRole(user.role); setShowRoleModal(true);}}>Role</button>
                                        <button className="btn btn-link text-danger text-decoration-none small fw-bold" onClick={() => {setSelectedUser(user); setShowDeleteModal(true);}}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {pagination && pagination.totalPage > 1 && (
                    <div className="p-4 border-top d-flex justify-content-between align-items-center bg-light bg-opacity-10">
                        <span className="small text-muted fw-bold">Page {pagination.pageIndex} / {pagination.totalPage}</span>
                        <div className="d-flex gap-2">
                            <button className="btn btn-modern btn-modern-outline btn-sm py-1 px-3" disabled={pagination.pageIndex === 1} onClick={() => setPageIndex(pagination.pageIndex - 1)}><i className="bi bi-chevron-left"></i></button>
                            <button className="btn btn-modern btn-modern-outline btn-sm py-1 px-3" disabled={pagination.pageIndex === pagination.totalPage} onClick={() => setPageIndex(pagination.pageIndex + 1)}><i className="bi bi-chevron-right"></i></button>
                        </div>
                    </div>
                )}
            </div>

            <CommonModal show={showModal} onHide={() => setShowModal(false)} title={editingUser ? "Modify User" : "Add User"} onSave={handleSave} loading={loading}>
                <div className="mb-4">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-2">Username</label>
                    <input type="text" className="form-control form-input-modern" value={formData.userName} onChange={(e) => setFormData({...formData, userName: e.target.value})} />
                </div>
                {!editingUser && (
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-muted text-uppercase mb-2">Initial Password</label>
                        <input type="password" className="form-control form-input-modern" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>
                )}
                <div className="row g-3">
                    <div className="col-6">
                        <CommonSelect label="Role" options={roleOptions} value={formData.role} onChange={(val) => setFormData({...formData, role: val as Role})} />
                    </div>
                    <div className="col-6">
                        <label className="form-label small fw-bold text-muted text-uppercase mb-2">Status</label>
                        <select className="form-select form-input-modern" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as UserStatus})}>
                            <option value={UserStatus.ACTIVE}>Active</option>
                            <option value={UserStatus.BANNED}>Banned</option>
                        </select>
                    </div>
                </div>
            </CommonModal>

            <CommonModal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} title="Archive Account" onSave={async () => {await deleteUser(selectedUser!.id); setShowDeleteModal(false);}} saveVariant="danger">
               <div className="text-center p-3"><p className="mb-0">Archive <strong>{selectedUser?.userName}</strong>?</p></div>
            </CommonModal>

            <CommonModal show={showRoleModal} onHide={() => setShowRoleModal(false)} title="Update Authority" onSave={async () => {await decentralieUser(selectedUser!.id, newRole); setShowRoleModal(false);}}>
                <CommonSelect label="Target Role" options={roleOptions} value={newRole} onChange={(val) => setNewRole(val as Role)} />
            </CommonModal>
        </div>
    );
}