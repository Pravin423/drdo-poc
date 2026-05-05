import { MapPin, Tag, Hash, Map, Save } from "lucide-react";
import { FormModal, FormHeader, FormError, FormInput, FormSelect, FormActions } from "@/components/common/FormUI";

export default function EditTalukaModal({
    isOpen,
    onClose,
    formData,
    onChange,
    onSave,
    formError,
    districts,
}) {
    return (
        <FormModal isOpen={isOpen} onClose={onClose}>
            <FormHeader 
                title="Edit Taluka" 
                subtitle="Update existing taluka details" 
                icon={MapPin} 
                onClose={onClose} 
            />

            <div className="p-8">
                <FormError error={formError} />

                <div className="space-y-6">
                    <FormInput
                        label="Taluka Name"
                        icon={Tag}
                        placeholder="e.g. Tiswadi"
                        maxLength={100}
                        value={formData.name}
                        error={formError?.includes("Taluka Name")}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^a-zA-Z\s\-]/g, "");
                            onChange({ ...formData, name: val });
                        }}
                    />

                    <FormInput
                        label="Census Code"
                        icon={Hash}
                        placeholder="Max 5 digits"
                        maxLength={5}
                        value={formData.censusCode}
                        error={formError?.includes("Census Code")}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            onChange({ ...formData, censusCode: val });
                        }}
                    />

                    <FormSelect
                        label="Parent District"
                        icon={Map}
                        placeholder="Select District"
                        value={formData.districtID}
                        error={formError?.includes("District")}
                        onChange={(e) => onChange({ ...formData, districtID: e.target.value })}
                        options={districts.map(d => ({ label: d.name, value: d.id }))}
                    />
                </div>

                <FormActions 
                    onCancel={onClose} 
                    onConfirm={onSave} 
                    confirmIcon={Save}
                    confirmText="Save Changes"
                />
            </div>
        </FormModal>
    );
}

