import { useState, useEffect } from "react";
import { useCategory } from "../hooks/use-category";
import CommonModal from "@core/ui/components/common-modal";
import CommonSelect from "@core/ui/components/common-select";
import type { CategoryViewDTO, CategoryCreateDTO, CategoryUpdateDTO } from "../dtos/category-dto";

export default function CategoryPage() {
    const {
        data,
        allData,
        pagination,
        loading,
        search,
        setSearch,
        setPageIndex,
        createCategory,
        updateCategory,
        deleteCategory,
        reload,
    } = useCategory();

    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryViewDTO | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        parentId: undefined as string | undefined,
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState<string>("");
    const [deletingName, setDeletingName] = useState<string>("");

    const [parentOptions, setParentOptions] = useState<{ value: string; label: string }[]>([]);
    const [loadingParents, setLoadingParents] = useState(false);

    useEffect(() => {
        const loadParentOptions = async () => {
            setLoadingParents(true);
            try {
                const allCategories = allData?.data;

                const options = allCategories!
                    .filter(category => category.id !== editingCategory?.id) 
                    .map(category => ({
                        value: category.id,
                        label: category.name
                    }));

                setParentOptions(options);
            } catch (error) {
                console.error("Failed to load parent categories:", error);
                setParentOptions([]);
            } finally {
                setLoadingParents(false);
            }
        };

        if (showModal) {
            loadParentOptions();
        }
    }, [showModal, editingCategory, allData]);

    const openCreateModal = () => {
        setEditingCategory(null);
        setFormData({ name: "", parentId: undefined });
        setShowModal(true);
    };

    const openEditModal = (category: CategoryViewDTO) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            parentId: category.parentId,
        });
        setShowModal(true);
    };

    const openDeleteConfirm = (id: string, name: string) => {
        setDeletingId(id);
        setDeletingName(name);
        setShowDeleteModal(true);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            alert("Vui lòng nhập tên danh mục!");
            return;
        }

        const payload = {
            name: formData.name.trim(),
            parentId: formData.parentId || undefined,
        };

        try {
            if (editingCategory) {
                await updateCategory({ ...payload, id: editingCategory.id } as CategoryUpdateDTO);
            } else {
                await createCategory(payload as CategoryCreateDTO);
            }
            setShowModal(false);
        } catch (error) {
            console.error("Save failed:", error);
            alert("Có lỗi xảy ra khi lưu danh mục!");
        }
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteCategory(deletingId);
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Không thể xóa danh mục!");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getParentName = (parentId?: string) => {
        if (!parentId) return "Không có";
        const parent = data.find(c => c.id === parentId);
        return parent ? `${parent.name}` : `Không có`;
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Quản lý Danh mục (Category)</h2>
                <button className="btn btn-success" onClick={openCreateModal}>
                    + Thêm danh mục mới
                </button>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm danh mục..."
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
                            <th style={{ width: "40%" }}>Tên danh mục</th>
                            <th style={{ width: "30%" }}>Danh mục cha</th>
                            <th style={{ width: "30%" }} className="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && data.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status" />
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-4 text-muted">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            data.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.name}</td>
                                    <td>{getParentName(category.parentId)}</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => openEditModal(category)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => openDeleteConfirm(category.id, category.name)}
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
                <nav aria-label="Pagination">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${pagination.pageIndex === 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => setPageIndex(pagination.pageIndex - 1)}
                            >
                                Trước
                            </button>
                        </li>

                        {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map((page) => (
                            <li
                                key={page}
                                className={`page-item ${page === pagination.pageIndex ? "active" : ""}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => setPageIndex(page)}
                                >
                                    {page}
                                </button>
                            </li>
                        ))}

                        <li className={`page-item ${pagination.pageIndex === pagination.totalPage ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => setPageIndex(pagination.pageIndex + 1)}
                            >
                                Sau
                            </button>
                        </li>
                    </ul>
                </nav>
            )}

            <CommonModal
                show={showModal}
                onHide={() => setShowModal(false)}
                title={editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
                onSave={handleSave}
                saveText={editingCategory ? "Cập nhật" : "Tạo mới"}
                loading={loading}
                size="lg"
                backdrop="static"
            >
                <div className="row">
                    <div className="col-12">
                        <div className="mb-3 d-flex flex-column align-items-start">
                            <label className="form-label fw-bold">
                                Tên danh mục <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Nhập tên danh mục"
                                required
                            />
                        </div>

                        <CommonSelect
                            label="Danh mục cha (Parent)"
                            options={parentOptions}
                            value={formData.parentId}
                            onChange={(newParentId) =>
                                setFormData(prev => ({ ...prev, parentId: newParentId }))
                            }
                            placeholder="Chọn danh mục cha (nếu có)"
                            loading={loadingParents}
                            showSearch={true}
                            required={false}
                        />
                    </div>
                </div>
            </CommonModal>

            <CommonModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                title="Xác nhận xóa danh mục"
                onSave={handleDelete}
                saveText="Xóa"
                saveVariant="danger"
                loading={loading}
                backdrop="static"
            >
                <div className="text-center py-3">
                    <p className="fs-5">
                        Bạn có chắc chắn muốn xóa danh mục:{" "}
                        <strong className="text-danger">"{deletingName}"</strong> ?
                    </p>
                    <p className="text-muted small">
                        Hành động này không thể hoàn tác.
                    </p>
                </div>
            </CommonModal>
        </div>
    );
}