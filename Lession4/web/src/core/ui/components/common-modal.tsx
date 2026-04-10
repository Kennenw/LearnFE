import { useEffect, useRef } from "react";

interface CommonModalProps {
    show: boolean;
    onHide: () => void;
    title: string;
    children: React.ReactNode;
    onSave?: () => void;
    saveText?: string;
    saveVariant?: "primary" | "success" | "danger";
    showSaveButton?: boolean;
    loading?: boolean;
    size?: "sm" | "lg" | "xl";
    centered?: boolean;
    backdrop?: boolean | "static";  
}

export default function CommonModal({
    show,
    onHide,
    title,
    children,
    onSave,
    saveText = "Save",
    saveVariant = "primary",
    showSaveButton = true,
    loading = false,
    size,
    centered = true,
    backdrop = true,
}: CommonModalProps) {

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!modalRef.current) return;

        if (show) {
            // Thêm class show thủ công
            modalRef.current.classList.add("show");
            modalRef.current.style.display = "block";
            document.body.classList.add("modal-open");
        } else {
            modalRef.current.classList.remove("show");
            modalRef.current.style.display = "none";
            document.body.classList.remove("modal-open");
        }
    }, [show]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === modalRef.current && backdrop !== "static") {
            onHide();
        }
    };

    if (!show) return null;

    return (
        <>
            <div 
                className="modal-backdrop fade show" 
                style={{ zIndex: 1040 }}
                onClick={backdrop !== "static" ? onHide : undefined}
            />

            <div
                ref={modalRef}
                className={`modal fade ${show ? "show" : ""}`}
                style={{ display: show ? "block" : "none", zIndex: 1050 }}
                tabIndex={-1}
                onClick={handleBackdropClick}
            >
                <div 
                    className={`modal-dialog ${centered ? "modal-dialog-centered" : ""} ${size ? `modal-${size}` : ""}`}
                    role="document"
                    onClick={(e) => e.stopPropagation()}   
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={onHide}
                                disabled={loading}
                            />
                        </div>

                        <div className="modal-body">
                            {children}
                        </div>

                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={onHide}
                                disabled={loading}
                            >
                                Hủy
                            </button>

                            {showSaveButton && onSave && (
                                <button 
                                    type="button" 
                                    className={`btn btn-${saveVariant}`}
                                    onClick={onSave}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Processing...
                                        </>
                                    ) : saveText}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}