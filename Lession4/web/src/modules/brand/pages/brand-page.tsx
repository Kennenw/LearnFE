import { useState } from "react";
import { useBrand } from "../hooks/use-brand";
import CommonModal from "@core/ui/components/common-modal";
import type { BrandViewDTO } from "../dtos/brand-dto";   // Giả sử bạn có DTO tương tự

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

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
            <div className="d-flex gap-2">
              <button
                className="btn-modern btn-modern-outline btn-sm"
                disabled={
                  loading || !pagination || !pagination.hasPreviousPage()
                }
                onClick={() => setPageIndex(currentPage - 1)}
              >
                Previous
              </button>
              <button
                className="btn-modern btn-modern-outline btn-sm"
                disabled={loading || !pagination || !pagination.hasNextPage()}
                onClick={() => setPageIndex(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
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
            <div className="modal-body py-4">
              <label className="small text-muted mb-2 d-block">Brand Name</label>
              <input
                className="input-modern"
                placeholder="Enter name field..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="modal-footer border-0">
              <button
                className="btn-modern btn-modern-outline"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                className="btn-modern btn-modern-primary px-4"
                disabled={!trimmedName || loading}
                onClick={handleSubmit}
              >
                {editingId ? "Update Brand" : "Create Brand"}
              </button>
            </div>
          </div>
        </div>
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
      </div>
    </>
  );
}
