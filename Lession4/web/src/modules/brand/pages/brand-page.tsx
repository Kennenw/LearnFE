import { useState } from "react";
import { useBrand } from "../hooks/use-brand";

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
        deleteBrand
    } = useBrand();

    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!name) return;

        if (editingId) {
            await updateBrand({ id: editingId, name });
        } else {
            await createBrand({ name });
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
            const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
            bsModal?.hide();
        }
    };

    const currentPage = pagination?.pageIndex ?? 1;
    const totalPage = pagination?.totalPage ?? 1;

    return (
        <div className="container mt-4">
            <h2>Brand Management</h2>

            <input
                className="form-control my-3"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <button
                className="btn btn-primary mb-3"
                data-bs-toggle="modal"
                data-bs-target="#brandModal"
                onClick={openCreate}
            >
                Add Brand
            </button>

            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={2}>Loading...</td></tr>
                    ) : (
                        data.map(b => (
                            <tr key={b.id}>
                                <td>{b.name}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#brandModal"
                                        onClick={() => openEdit(b.id, b.name)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteModal"
                                        onClick={() => setDeleteId(b.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-outline-primary"
                    disabled={!pagination?.hasPreviousPage()}
                    onClick={() => setPageIndex(currentPage - 1)}
                >
                    Prev
                </button>

                <span>
                    Page {currentPage} / {totalPage}
                </span>

                <button
                    className="btn btn-outline-primary"
                    disabled={!pagination?.hasNextPage()}
                    onClick={() => setPageIndex(currentPage + 1)}
                >
                    Next
                </button>
            </div>

            <div className="modal fade" id="brandModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {editingId ? "Edit Brand" : "Create Brand"}
                            </h5>
                            <button className="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body">
                            <input
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleSubmit}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="deleteModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Delete</h5>
                            <button className="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body">
                            Are you sure you want to delete this brand?
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancel
                            </button>
                            <button className="btn btn-danger" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}