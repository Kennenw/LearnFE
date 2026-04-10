import { useProduct } from "../hooks/use-product";
import { Link } from "react-router-dom";
import { ProductStatus } from "@core/enum/product";

export default function ProductManagerPage() {
    const { data, pagination, loading, search, setSearch, setPageIndex, deleteProduct, reload } = useProduct();
    const handleDelete = async (id: string, name: string) => { if (window.confirm(`Archive product "${name}"?`)) await deleteProduct(id); };

    return (
        <div className="container-fluid px-0">
            <header className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold mb-1">Catalog Manager</h2>
                    <p className="text-muted small mb-0">Directly control your cross-platform item collection</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-modern btn-modern-outline" onClick={reload}><i className="bi bi-arrow-clockwise"></i></button>
                    <Link to="/products/create" className="btn btn-modern btn-modern-primary px-4 text-decoration-none">
                        <i className="bi bi-plus-lg me-2"></i> Register Item
                    </Link>
                </div>
            </header>

            <div className="card-modern border-0 shadow-sm overflow-hidden mt-4">
                 <div className="p-4 bg-white border-bottom d-flex justify-content-between align-items-center">
                    <div className="col-md-5">
                         <div className="input-group overflow-hidden border rounded-3 bg-light bg-opacity-50 ps-3">
                            <span className="input-group-text bg-transparent border-0 pe-1 text-muted"><i className="bi bi-search"></i></span>
                            <input type="text" className="form-control border-0 bg-transparent shadow-none py-2" placeholder="Scan SKU or Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-modern mb-0">
                        <thead>
                            <tr>
                                <th className="px-4">Product Detail</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th className="text-center">Controls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((p) => (
                                <tr key={p.id}>
                                    <td className="px-4">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                                <i className="bi bi-box-seam text-muted opacity-50"></i>
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark">{p.name}</div>
                                                <div className="small text-muted line-clamp-1" style={{ maxWidth: '280px' }}>{p.description || "No description provided."}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex flex-column">
                                            <span className="fw-bold small text-dark">{p.categoryName}</span>
                                            <span className="text-muted" style={{ fontSize: '11px' }}>{p.brandName}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge rounded-pill px-3 py-1 ${p.status === ProductStatus.ACTIVE ? 'bg-success bg-opacity-10 text-success' : 'bg-slate-200 text-slate-500'} small fw-bold`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="text-center text-nowrap">
                                        <Link to={`/products/edit/${p.id}`} className="btn btn-link text-decoration-none small fw-bold me-2">Modify</Link>
                                        <Link to={`/products/${p.id}`} className="btn btn-link text-decoration-none small fw-bold text-muted me-2">Inspect</Link>
                                        <button className="btn btn-link text-danger text-decoration-none small fw-bold" onClick={() => handleDelete(p.id, p.name)}>Archive</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {pagination && pagination.totalPage > 1 && (
                    <div className="p-4 border-top d-flex justify-content-between align-items-center bg-light bg-opacity-10">
                        <span className="small text-muted fw-bold">Item batch {pagination.pageIndex} / {pagination.totalPage}</span>
                        <div className="d-flex gap-2">
                             <button className="btn btn-modern btn-modern-outline btn-sm py-1 px-3" disabled={pagination.pageIndex === 1} onClick={() => setPageIndex(pagination.pageIndex - 1)}><i className="bi bi-chevron-left"></i></button>
                             <button className="btn btn-modern btn-modern-outline btn-sm py-1 px-3" disabled={pagination.pageIndex === pagination.totalPage} onClick={() => setPageIndex(pagination.pageIndex + 1)}><i className="bi bi-chevron-right"></i></button>
                        </div>
                    </div>
                )}
            </div>
            <style>{` .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; } `}</style>
        </div>
    );
}