import { useState } from "react";
import { useBrand } from "../hooks/use-brand";
import CommonModal from "@core/ui/components/common-modal";
import type { BrandViewDTO } from "../dtos/brand-dto";

export default function BrandPage() {
    const { data, pagination, loading, search, setSearch, setPageIndex, createBrand, updateBrand, deleteBrand, reload } = useBrand();

    const [showBrandModal, setShowBrandModal] = useState(false);
    const [editingBrand, setEditingBrand] = useState<BrandViewDTO | null>(null);
    const [brandName, setBrandName] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingBrand, setDeletingBrand] = useState<BrandViewDTO | null>(null);

    const handleSaveBrand = async () => {
        if (!brandName.trim()) return;
        try {
            if (editingBrand) await updateBrand({ id: editingBrand.id, name: brandName.trim() });
            else await createBrand({ name: brandName.trim() });
            setShowBrandModal(false);
        } catch { alert("Failed to save."); }
    };

    return (
        <div className="container-fluid px-0">
            <header className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold mb-1">Brand Directory</h2>
                    <p className="text-muted small mb-0">Manage the manufacturers and partners in your ecosystem</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-modern btn-modern-outline" onClick={reload}><i className="bi bi-arrow-clockwise"></i></button>
                    <button className="btn btn-modern btn-modern-primary px-4" onClick={() => { setEditingBrand(null); setBrandName(""); setShowBrandModal(true); }}>
                        <i className="bi bi-plus-lg me-2"></i> Register Brand
                    </button>
                </div>
            </header>

            <div className="card-modern border-0 shadow-sm overflow-hidden">
                <div className="p-4 bg-white border-bottom d-flex justify-content-between align-items-center">
                    <div className="col-md-5">
                        <div className="input-group overflow-hidden border rounded-3 bg-light bg-opacity-50 ps-3">
                            <span className="input-group-text bg-transparent border-0 pe-1 text-muted"><i className="bi bi-search"></i></span>
                            <input type="text" className="form-control border-0 bg-transparent shadow-none py-2" placeholder="Search brands..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </div>
                    <div className="text-muted small fw-bold">{data.length} brands found</div>
                </div>

                <div className="table-responsive">
                    <table className="table table-modern mb-0">
                        <thead>
                            <tr>
                                <th className="px-4">Brand Asset Name</th>
                                <th className="text-center" style={{ width: "200px" }}>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((brand) => (
                                <tr key={brand.id}>
                                    <td className="px-4">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '11px' }}>
                                                {brand.name.charAt(0)}
                                            </div>
                                            <span className="fw-semibold text-dark">{brand.name}</span>
                                        </div>
                                    </td>
                                    <td className="text-center text-nowrap">
                                        <button className="btn btn-link text-decoration-none small fw-bold me-2" onClick={() => { setEditingBrand(brand); setBrandName(brand.name); setShowBrandModal(true); }}>Edit</button>
                                        <button className="btn btn-link text-danger text-decoration-none small fw-bold" onClick={() => { setDeletingBrand(brand); setShowDeleteModal(true); }}>Archive</button>
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
                            <button className="btn btn-modern btn-modern-outline btn-sm py-1" disabled={pagination.pageIndex === 1} onClick={() => setPageIndex(pagination.pageIndex - 1)}><i className="bi bi-chevron-left"></i></button>
                            <button className="btn btn-modern btn-modern-outline btn-sm py-1" disabled={pagination.pageIndex === pagination.totalPage} onClick={() => setPageIndex(pagination.pageIndex + 1)}><i className="bi bi-chevron-right"></i></button>
                        </div>
                    </div>
                )}
            </div>

            <CommonModal show={showBrandModal} onHide={() => setShowBrandModal(false)} title={editingBrand ? "Modify Brand" : "Add Brand"} onSave={handleSaveBrand}>
                <div>
                    <label className="form-label small fw-bold text-muted text-uppercase mb-2">Internal Label</label>
                    <input type="text" className="form-control form-input-modern" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Nike" />
                </div>
            </CommonModal>

            <CommonModal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} title="Archive Brand" onSave={async () => { if (deletingBrand) await deleteBrand(deletingBrand.id); setShowDeleteModal(false); }} saveVariant="danger">
               <div className="text-center p-3">
                   <p className="mb-0">Are you sure you want to archive <strong>{deletingBrand?.name}</strong>?</p>
               </div>
            </CommonModal>
        </div>
    );
}
