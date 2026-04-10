import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/use-product";
import { useCategory } from "@modules/category/hooks/use-category";
import { useBrand } from "@modules/brand/hooks/use-brand";

import CommonSelect from "@core/ui/components/common-select";
import { Size } from "@core/enum/product-variant";
import { ProductStatus } from "@core/enum/product";
import { ProductCreateApplicationDTO, ProductUpdateApplicationDTO } from "../dtos/product-application-dto";

export default function ProductFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { createProduct, updateProduct, productDetail, fetchProductDetail, loading } = useProduct();
    const { allCategory } = useCategory();
    const { allBrand } = useBrand();

    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        categoryId: "" as string | undefined,
        brandId: "" as string | undefined,
        status: ProductStatus.ACTIVE,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [variants, setVariants] = useState<any[]>([
        { size: Size.S, color: "", price: 0, stockQuantity: 0 }
    ]);

    const categoryOptions = allCategory?.data?.map(cat => ({
        value: cat.id,
        label: cat.name
    })) || [];

    const brandOptions = allBrand?.data?.map(brand => ({
        value: brand.id,
        label: brand.name
    })) || [];

    useEffect(() => {
        if (isEdit && id) {
            fetchProductDetail(id);
        }
    }, [id, isEdit, fetchProductDetail]);

    useEffect(() => {
        if (isEdit && productDetail) {
            const p = productDetail.product;
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                name: p.name,
                description: p.description,
                categoryId: p.categoryId,
                brandId: p.brandId,
                status: p.status,
            });

            setVariants(productDetail.variants.map(v => ({
                id: v.id,
                size: v.size,
                color: v.color,
                price: v.price,
                stockQuantity: v.stockQuantity,
            })));
        }
    }, [productDetail, isEdit]);

    const handleAddVariant = () => {
        setVariants([...variants, { size: Size.S, color: "", price: 0, stockQuantity: 0 }]);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleVariantChange = (index: number, field: string, value: any) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };

    const handleRemoveVariant = (index: number) => {
        if (variants.length === 1) return;
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.categoryId || !formData.brandId) {
            alert("Vui lòng nhập đầy đủ thông tin sản phẩm!");
            return;
        }

        const payload = {
            product: isEdit 
                ? { ...formData, id: id! } 
                : formData,
            variants: variants.filter(v => v.color && v.price > 0)
        };

        try {
            if (isEdit) {
                await updateProduct(payload as ProductUpdateApplicationDTO);
            } else {
                await createProduct(payload as ProductCreateApplicationDTO);
            }
            navigate("/products");
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi lưu sản phẩm!");
        }
    };

    return (
        <div className="container mt-4">
            <h2>{isEdit ? "Cập nhật Sản phẩm" : "Thêm Sản phẩm mới"}</h2>

            <form onSubmit={handleSubmit}>
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="mb-3">
                            <label className="form-label">Tên sản phẩm <span className="text-danger">*</span></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={formData.name} 
                                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                                required 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Mô tả</label>
                            <textarea 
                                className="form-control" 
                                rows={3} 
                                value={formData.description} 
                                onChange={e => setFormData({ ...formData, description: e.target.value })} 
                            />
                        </div>

                        <div className="row g-3">
                            <div className="col-md-4">
                                <CommonSelect
                                    label="Danh mục"
                                    options={categoryOptions}
                                    value={formData.categoryId || ""}
                                    onChange={(val) => setFormData({ ...formData, categoryId: val || undefined })}
                                    placeholder="Chọn danh mục"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <CommonSelect
                                    label="Thương hiệu"
                                    options={brandOptions}
                                    value={formData.brandId || ""}
                                    onChange={(val) => setFormData({ ...formData, brandId: val || undefined })}
                                    placeholder="Chọn thương hiệu"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Trạng thái</label>
                                <select 
                                    className="form-select" 
                                    value={formData.status} 
                                    onChange={e => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                                >
                                    <option value={ProductStatus.ACTIVE}>Hoạt động</option>
                                    <option value={ProductStatus.INACTIVE}>Ngừng hoạt động</option>
                                    <option value={ProductStatus.DRAFT}>Nháp</option>
                                    <option value={ProductStatus.HIDDEN}>Ẩn</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5>Biến thể sản phẩm</h5>
                        <button type="button" className="btn btn-sm btn-primary" onClick={handleAddVariant}>
                            + Thêm biến thể
                        </button>
                    </div>
                    <div className="card-body">
                        {variants.map((variant, index) => (
                            <div key={index} className="border p-3 mb-3 rounded bg-light">
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <label className="form-label">Màu sắc <span className="text-danger">*</span></label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={variant.color} 
                                            onChange={e => handleVariantChange(index, 'color', e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Kích cỡ</label>
                                        <select 
                                            className="form-select" 
                                            value={variant.size} 
                                            onChange={e => handleVariantChange(index, 'size', e.target.value)}
                                        >
                                            {Object.values(Size).map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Giá (VNĐ) <span className="text-danger">*</span></label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            value={variant.price} 
                                            onChange={e => handleVariantChange(index, 'price', Number(e.target.value))} 
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Tồn kho <span className="text-danger">*</span></label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            value={variant.stockQuantity} 
                                            onChange={e => handleVariantChange(index, 'stockQuantity', Number(e.target.value))} 
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-1 d-flex align-items-end">
                                        {variants.length > 1 && (
                                            <button 
                                                type="button" 
                                                className="btn btn-danger btn-sm w-100" 
                                                onClick={() => handleRemoveVariant(index)}
                                            >
                                                Xóa
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg px-5" disabled={loading}>
                    {loading ? "Đang xử lý..." : isEdit ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}
                </button>
            </form>
        </div>
    );
}