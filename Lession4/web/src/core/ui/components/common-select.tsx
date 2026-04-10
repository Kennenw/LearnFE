interface Option {
    value: string;
    label: string;
}

interface CommonSelectProps {
    label?: string;
    options: Option[];
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
    loading?: boolean;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    showSearch?: boolean;
    emptyMessage?: string;
}

export default function CommonSelect({
    label,
    options,
    value,
    onChange,
    placeholder = "Chọn một mục...",
    loading = false,
    disabled = false,
    required = false,
    className = "",
}: CommonSelectProps) {

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        onChange(newValue === "" ? undefined : newValue);
    };

    return (
        <div className={`mb-3 ${className}`}>
            {label && (
                <label className="form-label fw-bold d-flex flex-column align-items-start">
                    {label} {required && <span className="text-danger">*</span>}
                </label>
            )}

            <div className="position-relative">
                <select
                    className="form-select"
                    value={value || ""}
                    onChange={handleChange}
                    disabled={disabled || loading}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {loading && (
                    <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                        <span className="spinner-border spinner-border-sm text-primary" />
                    </div>
                )}
            </div>
        </div>
    );
}