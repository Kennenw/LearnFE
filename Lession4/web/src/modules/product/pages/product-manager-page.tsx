import { useState } from "react";
import { useProduct } from "../hooks/use-product";
import { Link } from "react-router-dom";
import { ProductStatus } from "@core/enum/product";
import CommonModal from "@core/ui/components/common-modal";

export default function ProductManagerPage() {
    const {
        data,
        pagination,
        loading,
        search,
        setSearch,
        setPageIndex,
        deleteProduct,
        reload,
    } = useProduct();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState<string>("");
    const [deletingName, setDeletingName] = useState<string>("");

    const openDeleteConfirm = (id: string, name: string) => {
        setDeletingId(id);
        setDeletingName(name);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        await deleteProduct(deletingId);
        setShowDeleteModal(false);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Quản lý Sản phẩm</h2>
                <Link to="/products/create" className="btn btn-success">
                    + Thêm sản phẩm mới
                </Link>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm sản phẩm..."
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
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Tên sản phẩm</th>
                            <th>Danh mục</th>
                            <th>Thương hiệu</th>
                            <th>Trạng thái</th>
                            <th className="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && data.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-4"><div className="spinner-border" /></td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-4 text-muted">Không có sản phẩm nào</td></tr>
                        ) : (
                            data.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.categoryName}</td>
                                    <td>{product.brandName}</td>
                                    <td>
                                        <span className={`badge ${product.status === ProductStatus.ACTIVE ? 'bg-success' : 'bg-secondary'}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <Link to={`/products/${product.id}`} className="btn btn-sm btn-info me-2">
                                            Chi tiết
                                        </Link>
                                        <Link to={`/products/edit/${product.id}`} className="btn btn-sm btn-warning me-2">
                                            Sửa
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => openDeleteConfirm(product.id, product.name)}
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

            {/* Pagination */}
            {pagination && pagination.totalPage > 1 && (
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${pagination.pageIndex === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setPageIndex(pagination.pageIndex - 1)}>Trước</button>
                        </li>
                        {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map(page => (
                            <li key={page} className={`page-item ${page === pagination.pageIndex ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setPageIndex(page)}>{page}</button>
                            </li>
                        ))}
                        <li className={`page-item ${pagination.pageIndex === pagination.totalPage ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setPageIndex(pagination.pageIndex + 1)}>Sau</button>
                        </li>
                    </ul>
                </nav>
            )}

            <CommonModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                title="Xác nhận xóa sản phẩm"
                onSave={handleDelete}
                saveText="Xóa"
                saveVariant="danger"
                loading={loading}
            >
                <p>Bạn có chắc muốn xóa sản phẩm <strong>"{deletingName}"</strong>?</p>
                <p className="text-danger small">Tất cả biến thể sẽ bị xóa theo.</p>
            </CommonModal>
        </div>
    );
}