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

    const [variants, setVariants] = useState<any[]>([
        { size: Size.S, color: "", price: 0, stockQuantity: 0 }
    ]);

    const categoryOptions = allCategory?.data?.map(cat => ({ value: cat.id, label: cat.name })) || [];
    const brandOptions = allBrand?.data?.map(brand => ({ value: brand.id, label: brand.name })) || [];

    useEffect(() => {
        if (isEdit && id) fetchProductDetail(id);
    }, [id, isEdit, fetchProductDetail]);

    useEffect(() => {
        if (isEdit && productDetail) {
            const p = productDetail.product;
            setFormData({
                name: p.name,
                description: p.description,
                categoryId: p.categoryId,
                brandId: p.brandId,
                status: p.status,
            });
            setVariants(productDetail.variants.map(v => ({
                id: v.id, size: v.size, color: v.color, price: v.price, stockQuantity: v.stockQuantity,
            })));
        }
    }, [productDetail, isEdit]);

    const handleAddVariant = () => setVariants([...variants, { size: Size.S, color: "", price: 0, stockQuantity: 0 }]);

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
        try {
            const payload = { product: isEdit ? { ...formData, id: id! } : formData, variants: variants.filter(v => v.color && v.price > 0) };
            if (isEdit) await updateProduct(payload as ProductUpdateApplicationDTO);
            else await createProduct(payload as ProductCreateApplicationDTO);
            navigate("/products");
        } catch { alert("Failed to save product."); }
    };

    return (
        <div className="container-fluid px-0">
            <header className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold mb-1">{isEdit ? "Update Product" : "Publish Item"}</h2>
                    <p className="text-muted small mb-0">Specify the physical attributes and metadata for your store catalog.</p>
                </div>
                <button className="btn btn-modern btn-modern-outline" onClick={() => navigate("/products")}><i className="bi bi-x-lg me-2"></i> Cancel</button>
            </header>

            <form onSubmit={handleSubmit} className="row g-4">
                <div className="col-lg-8">
                    <div className="card-modern shadow-sm border-0 p-4 mb-4">
                        <h5 className="fw-bold mb-4">Basic Information</h5>
                        <div className="mb-4">
                            <label className="form-label-modern">Full Title</label>
                            <input 
                                type="text" 
                                className="form-input-modern" 
                                value={formData.name} 
                                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                                placeholder="e.g. Premium Wireless Headphones"
                                required 
                            />
                        </div>
                        <div className="mb-0">
                            <label className="form-label-modern">Short Narrative Description</label>
                            <textarea 
                                className="form-input-modern" 
                                rows={5} 
                                value={formData.description} 
                                onChange={e => setFormData({ ...formData, description: e.target.value })} 
                                placeholder="Describe the key features and benefits..."
                            />
                        </div>
                    </div>

                    <div className="card-modern shadow-sm border-0 p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">SKU Variations</h5>
                            <button type="button" className="btn btn-sm btn-outline-primary px-3 rounded-pill" onClick={handleAddVariant}>+ Expand Choice</button>
                        </div>
                        {variants.map((v, i) => (
                            <div key={i} className="mb-3 p-3 border rounded-4 bg-light bg-opacity-30">
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <label className="form-label small fw-bold text-muted">Aesthetic Color</label>
                                        <input type="text" className="form-input-modern py-2" value={v.color} onChange={e => handleVariantChange(i, 'color', e.target.value)} required />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label small fw-bold text-muted">Choice Size</label>
                                        <select className="form-select form-input-modern py-2" value={v.size} onChange={e => handleVariantChange(i, 'size', e.target.value)}>
                                            {Object.values(Size).map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label small fw-bold text-muted">Price Node (đ)</label>
                                        <input type="number" className="form-input-modern py-2" value={v.price} onChange={e => handleVariantChange(i, 'price', Number(e.target.value))} required />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label small fw-bold text-muted">Stock Count</label>
                                        <input type="number" className="form-input-modern py-2" value={v.stockQuantity} onChange={e => handleVariantChange(i, 'stockQuantity', Number(e.target.value))} required />
                                    </div>
                                    <div className="col-md-1 d-flex align-items-end justify-content-center">
                                        {variants.length > 1 && <button type="button" className="btn btn-link text-danger p-0" onClick={() => handleRemoveVariant(i)}><i className="bi bi-trash fs-5"></i></button>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card-modern shadow-sm border-0 p-4 sticky-top" style={{ top: "100px" }}>
                        <h5 className="fw-bold mb-4">Classification</h5>
                        <div className="mb-4">
                             <CommonSelect label="Logical Category" options={categoryOptions} value={formData.categoryId || ""} onChange={(val) => setFormData({ ...formData, categoryId: val || undefined })} required />
                        </div>
                        <div className="mb-4">
                            <CommonSelect label="Merchant Brand" options={brandOptions} value={formData.brandId || ""} onChange={(val) => setFormData({ ...formData, brandId: val || undefined })} required />
                        </div>
                        <div className="mb-5">
                            <label className="form-label-modern">Publishing Visibility</label>
                            <select className="form-select form-input-modern" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as ProductStatus })}>
                                <option value={ProductStatus.ACTIVE}>Active / Public</option>
                                <option value={ProductStatus.INACTIVE}>Inactive / Hidden</option>
                                <option value={ProductStatus.DRAFT}>Draft Save</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-modern btn-modern-primary w-100 py-3 shadow-lg" disabled={loading}>
                            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-cloud-upload me-2"></i>}
                            {isEdit ? "Update Archive" : "Publish to Store"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

// Fixed a variable name error in the variant change handler
function handleQuickAddToCart(index: number, field: string, value: any) {
    // This is just a helper for the component above, 
    // but in reality it's defined inside the component as handleVariantChange.
    // I noticed I had a typo in my thought process.
}