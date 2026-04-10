import { useState } from "react";
import { useBrand } from "../hooks/use-brand";
import CommonModal from "@core/ui/components/common-modal";
import type { BrandViewDTO } from "../dtos/brand-dto";   // Giả sử bạn có DTO tương tự

export default function BrandPage() {
    const {
        data,
        pagination,
        loading,
        search,
        setSearch,
        setPageIndex,
        createBrand,
        updateBrand,
        deleteBrand,
    } = useBrand();

    const [showBrandModal, setShowBrandModal] = useState(false);
    const [editingBrand, setEditingBrand] = useState<BrandViewDTO | null>(null);
    const [brandName, setBrandName] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingBrand, setDeletingBrand] = useState<BrandViewDTO | null>(null);

    const openCreateModal = () => {
        setEditingBrand(null);
        setBrandName("");
        setShowBrandModal(true);
    };

    const openEditModal = (brand: BrandViewDTO) => {
        setEditingBrand(brand);
        setBrandName(brand.name);
        setShowBrandModal(true);
    };

    const openDeleteConfirm = (brand: BrandViewDTO) => {
        setDeletingBrand(brand);
        setShowDeleteModal(true);
    };

    const handleSaveBrand = async () => {
        if (!brandName.trim()) {
            alert("Brand name is required!");
            return;
        }

        try {
            if (editingBrand) {
                await updateBrand({ id: editingBrand.id, name: brandName.trim() });
            } else {
                await createBrand({ name: brandName.trim() });
            }
            setShowBrandModal(false);
        } catch (err) {
            console.error(err);
            alert("Failed to save brand!");
        }
    };

    const handleDeleteBrand = async () => {
        if (!deletingBrand) return;
        try {
            await deleteBrand(deletingBrand.id);
            setShowDeleteModal(false);
        } catch (err) {
            console.error(err);
            alert("Failed to delete brand!");
        }
    };

    const currentPage = pagination?.pageIndex ?? 1;
    const totalPages = pagination?.totalPage ?? 1;
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Brand Management</h2>
                <button className="btn btn-success" onClick={openCreateModal}>
                    + Add New Brand
                </button>
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Search brands..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Brand Name</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && data.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="text-center py-4">
                                    <div className="spinner-border text-primary" />
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="text-center py-4 text-muted">
                                    No brands found
                                </td>
                            </tr>
                        ) : (
                            data.map((brand) => (
                                <tr key={brand.id}>
                                    <td>{brand.name}</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => openEditModal(brand)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => openDeleteConfirm(brand)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && totalPages > 1 && (
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => setPageIndex(currentPage - 1)}
                            >
                                Previous
                            </button>
                        </li>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <li
                                key={page}
                                className={`page-item ${page === currentPage ? "active" : ""}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => setPageIndex(page)}
                                >
                                    {page}
                                </button>
                            </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => setPageIndex(currentPage + 1)}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            )}

            <CommonModal
                show={showBrandModal}
                onHide={() => setShowBrandModal(false)}
                title={editingBrand ? "Edit Brand" : "Create New Brand"}
                onSave={handleSaveBrand}
                saveText={editingBrand ? "Update" : "Create"}
                loading={loading}
                backdrop="static"
            >
                <div className="mb-3 d-flex flex-column align-items-start">
                    <label className="form-label fw-bold">
                        Brand Name <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="Enter brand name"
                        required
                    />
                </div>
            </CommonModal>

            <CommonModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                title="Confirm Delete"
                onSave={handleDeleteBrand}
                saveText="Delete"
                saveVariant="danger"
                loading={loading}
                backdrop="static"
            >
                <div className="text-center py-3 ">
                    <p className="fs-5 mb-1">
                        Are you sure you want to delete the brand:
                    </p>
                    <p className="fw-bold text-danger">
                        "{deletingBrand?.name}"
                    </p>
                    <p className="text-muted small">
                        This action cannot be undone.
                    </p>
                </div>
            </CommonModal>
        </div>
    );
}