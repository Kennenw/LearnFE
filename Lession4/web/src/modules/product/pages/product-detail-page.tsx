import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "../hooks/use-product";
import { ProductVariantViewDTO } from "../dtos/product-variant-dto";
import { ProductStatus } from "@core/enum/product";
import CommonModal from "@core/ui/components/common-modal";

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { productDetail, loading, fetchProductDetail, removeVariant } = useProduct();

    const [showDeleteVariantModal, setShowDeleteVariantModal] = useState(false);
    const [deletingVariant, setDeletingVariant] = useState<ProductVariantViewDTO | null>(null);

    useEffect(() => {
        if (id) {
            fetchProductDetail(id);
        }
    }, [fetchProductDetail, id]);

    const openDeleteVariant = (variant: ProductVariantViewDTO) => {
        setDeletingVariant(variant);
        setShowDeleteVariantModal(true);
    };

    const handleDeleteVariant = async () => {
        if (!deletingVariant || !id) return;
        await removeVariant(id, deletingVariant.id);
        setShowDeleteVariantModal(false);
    };

    if (loading && !productDetail) return <div className="text-center mt-5"><div className="spinner-border" /></div>;

    if (!productDetail) return <div className="alert alert-danger">Không tìm thấy sản phẩm</div>;

    const { product, variants } = productDetail;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-4">
                <h2>Chi tiết sản phẩm</h2>
                <div>
                    <Link to={`/products/edit/${product.id}`} className="btn btn-warning me-2">Sửa sản phẩm</Link>
                    <Link to="/products" className="btn btn-secondary">Quay lại danh sách</Link>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h4>{product.name}</h4>
                    <p><strong>Mô tả:</strong> {product.description}</p>
                    <p><strong>Danh mục:</strong> {product.categoryName}</p>
                    <p><strong>Thương hiệu:</strong> {product.brandName}</p>
                    <p><strong>Trạng thái:</strong>
                        <span className={`badge ms-2 ${product.status === ProductStatus.ACTIVE ? 'bg-success' : 'bg-secondary'}`}>
                            {product.status}
                        </span>
                    </p>
                </div>
            </div>

            <h5>Biến thể sản phẩm ({variants.length})</h5>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>Màu sắc</th>
                            <th>Kích cỡ</th>
                            <th>Giá</th>
                            <th>Số lượng tồn</th>
                            <th className="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {variants.map(variant => (
                            <tr key={variant.id}>
                                <td>{variant.color}</td>
                                <td>{variant.size}</td>
                                <td>{variant.price.toLocaleString()} đ</td>
                                <td>{variant.stockQuantity}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => openDeleteVariant(variant)}
                                    >
                                        Xóa biến thể
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CommonModal
                show={showDeleteVariantModal}
                onHide={() => setShowDeleteVariantModal(false)}
                title="Xóa biến thể"
                onSave={handleDeleteVariant}
                saveText="Xóa"
                saveVariant="danger"
            >
                <p>Bạn có chắc muốn xóa biến thể <strong>{deletingVariant?.color} - {deletingVariant?.size}</strong>?</p>
            </CommonModal>
        </div>
    );
}