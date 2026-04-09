import { useState } from "react";
import { useBrand } from "../hooks/use-brand";

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
    loading,
    search,
    setSearch,
    setPageIndex,
    pagination,
    createBrand,
    updateBrand,
    deleteBrand,
  } = useBrand();

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const trimmedName = name.trim();

  const handleSubmit = async () => {
    if (!trimmedName) return;
    if (editingId) {
      await updateBrand({ id: editingId, name: trimmedName });
    } else {
      await createBrand({ name: trimmedName });
    }
    setName("");
    setEditingId(null);
    closeModal("brandModal");
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteBrand(deleteId);
    setDeleteId(null);
    closeModal("deleteModal");
  };

  const openCreate = () => {
    setEditingId(null);
    setName("");
  };

  const openEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setName(currentName);
  };

  const closeModal = (id: string) => {
    const modal = document.getElementById(id);
    if (modal) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bootstrap = (window as any).bootstrap;
      if (bootstrap) {
        const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
        bsModal?.hide();
      }
    }
  };

  const currentPage = pagination?.pageIndex ?? 1;
  const totalPage = pagination?.totalPage ?? 1;

  return (
    <>
      <div
        className="animate-fade-in"
        style={{ maxWidth: "1000px", margin: "0 auto" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem" }}>Brand Management</h1>
            <p className="text-muted">
              Manage system brands and their identities.
            </p>
          </div>
          <button
            className="btn-modern btn-modern-primary"
            data-bs-toggle="modal"
            data-bs-target="#brandModal"
            onClick={openCreate}
          >
            <PlusIcon /> Add New Brand
          </button>
        </div>

        <div className="glass-card p-4 mb-4">
          <div className="position-relative mb-4">
            <span className="position-absolute top-50 translate-middle-y ms-3 text-muted">
              <SearchIcon />
            </span>
            <input
              className="input-modern ps-5"
              placeholder="Find by brand name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Brand ID</th>
                  <th>Name</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-5">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      Loading brand data...
                    </td>
                  </tr>
                ) : pagination === null ? (
                  <tr>
                    <td colSpan={3} className="text-center py-5 text-muted">
                      Initializing repository...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-5 text-muted">
                      No brands found in the system.
                    </td>
                  </tr>
                ) : (
                  data.map((b) => (
                    <tr key={b.id} className="animate-fade-in">
                      <td>
                        <span className="badge-modern">{b.id.slice(0, 8)}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{b.name}</td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn-modern btn-modern-outline me-2"
                          style={{ padding: "0.5rem" }}
                          data-bs-toggle="modal"
                          data-bs-target="#brandModal"
                          onClick={() => openEdit(b.id, b.name)}
                          title="Edit Brand"
                        >
                          <EditIcon />
                        </button>

                        <button
                          className="btn-modern btn-modern-outline"
                          style={{
                            padding: "0.5rem",
                            color: "#ef4444",
                            borderColor: deleteId === b.id ? "#ef4444" : "",
                          }}
                          data-bs-toggle="modal"
                          data-bs-target="#deleteModal"
                          onClick={() => setDeleteId(b.id)}
                          title="Delete Brand"
                        >
                          <DeleteIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
            <div className="text-muted small">
              Page {currentPage} of {totalPage}
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

      {/* Modals outside the animated container */}
      <div
        className="modal fade"
        id="brandModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content glass-card p-2"
            style={{ transform: "none" }}
          >
            <div className="modal-header border-0">
              <h5
                className="modal-title"
                style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
              >
                {editingId ? "Edit Brand" : "Create New Brand"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
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

      <div
        className="modal fade"
        id="deleteModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content glass-card p-2"
            style={{ transform: "none" }}
          >
            <div className="modal-header border-0">
              <h5
                className="modal-title text-danger"
                style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
              >
                Delete Brand
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body py-4">
              <p className="text-muted">
                Are you sure you want to delete this brand from the repository?
                This action is permanent.
              </p>
            </div>
            <div className="modal-footer border-0">
              <button
                className="btn-modern btn-modern-outline"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                className="btn-modern btn-modern-primary"
                style={{ backgroundColor: "#ef4444" }}
                disabled={loading}
                onClick={handleDelete}
              >
                Delete Brand
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
