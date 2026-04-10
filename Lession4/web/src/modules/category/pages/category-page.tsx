import { useState, useEffect } from "react";
import { useCategory } from "../hooks/use-category";
import CommonModal from "@core/ui/components/common-modal";
import CommonSelect from "@core/ui/components/common-select";
import type { CategoryViewDTO, CategoryCreateDTO, CategoryUpdateDTO } from "../dtos/category-dto";

export default function CategoryPage() {
    const { data, allCategory, search, setSearch, createCategory, updateCategory, deleteCategory, reload } = useCategory();
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryViewDTO | null>(null);
    const [formData, setFormData] = useState({ name: "", parentId: undefined as string | undefined });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState("");
    const [deletingName, setDeletingName] = useState("");
    const [parentOptions, setParentOptions] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        if (showModal && allCategory?.data) {
            setParentOptions(allCategory.data.filter(c => c.id !== editingCategory?.id).map(c => ({ value: c.id, label: c.name })));
        }
    }, [showModal, editingCategory, allCategory]);

    const handleSave = async () => {
        if (!formData.name.trim()) return;
        try {
            if (editingCategory) await updateCategory({ ...formData, id: editingCategory.id } as CategoryUpdateDTO);
            else await createCategory(formData as CategoryCreateDTO);
            setShowModal(false);
        } catch { alert("Error saving."); }
    };

    return (
        <div className="container-fluid px-0">
            <header className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold mb-1">Taxonomy</h2>
                    <p className="text-muted small mb-0">Organize and classify your product inventory</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-modern btn-modern-outline" onClick={reload}><i className="bi bi-arrow-clockwise"></i></button>
                    <button className="btn btn-modern btn-modern-primary px-4" onClick={() => { setEditingCategory(null); setFormData({ name: "", parentId: undefined }); setShowModal(true); }}>
                        <i className="bi bi-plus-lg me-2"></i> New Node
                    </button>
                </div>
            </header>

            <div className="card-modern border-0 shadow-sm overflow-hidden mt-4">
                <div className="p-4 bg-white border-bottom d-flex justify-content-between align-items-center">
                    <div className="col-md-5">
                        <div className="input-group overflow-hidden border rounded-3 bg-light bg-opacity-50 ps-3">
                            <span className="input-group-text bg-transparent border-0 pe-1 text-muted"><i className="bi bi-search"></i></span>
                            <input type="text" className="form-control border-0 bg-transparent shadow-none py-2" placeholder="Find category..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-modern mb-0">
                        <thead>
                            <tr>
                                <th className="px-4">Classification Label</th>
                                <th>Hierarchical Parent</th>
                                <th className="text-center">Controls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((c) => (
                                <tr key={c.id}>
                                    <td className="px-4 fw-bold text-dark">{c.name}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 small fw-bold" style={{ fontSize: '10px' }}>
                                                {data.find(parent => parent.id === c.parentId)?.name || "ROOT"}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <button className="btn btn-link text-decoration-none small fw-bold me-2" onClick={() => { setEditingCategory(c); setFormData({ name: c.name, parentId: c.parentId }); setShowModal(true); }}>Edit</button>
                                        <button className="btn btn-link text-danger text-decoration-none small fw-bold" onClick={() => { setDeletingId(c.id); setDeletingName(c.name); setShowDeleteModal(true); }}>Archive</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CommonModal show={showModal} onHide={() => setShowModal(false)} title="Classification Detail" onSave={handleSave}>
                <div className="mb-4">
                    <label className="form-label small fw-bold text-muted text-uppercase mb-2">Display Name</label>
                    <input type="text" className="form-control form-input-modern" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Footwear" />
                </div>
                <div className="mb-2">
                    <CommonSelect label="Parent Node" options={parentOptions} value={formData.parentId} onChange={(val) => setFormData({ ...formData, parentId: val })} />
                </div>
            </CommonModal>

            <CommonModal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} title="Archive Node" onSave={async () => { await deleteCategory(deletingId); setShowDeleteModal(false); }} saveVariant="danger">
                <div className="text-center p-3 text-danger"><p className="mb-0">Are you sure you want to archive <strong>{deletingName}</strong>?</p></div>
            </CommonModal>
        </div>
    );
}