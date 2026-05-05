import { MapPin, Tag, Hash, Map, Save } from "lucide-react";
import { FormModal, FormHeader, FormError, FormInput, FormSelect, FormActions } from "@/components/common/FormUI";

export default function EditVillageModal({
    isOpen,
    onClose,
    formData,
    onChange,
    onSave,
    formError,
    districts,
    modalTalukas,
    onDistrictChange,
}) {
    return (
        <FormModal isOpen={isOpen} onClose={onClose}>
            <FormHeader 
                title="Edit Village" 
                subtitle="Update existing village details" 
                icon={MapPin} 
                onClose={onClose} 
            />

            <div className="p-8">
                <FormError error={formError} />

                <div className="space-y-6">
                    <FormInput
                        label="Village Name"
                        icon={Tag}
                        placeholder="e.g. Calangute"
                        maxLength={100}
                        value={formData.name}
                        error={formError?.includes("Village Name")}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^a-zA-Z\s\-]/g, "");
                            onChange({ ...formData, name: val });
                        }}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormSelect
                            label="District Name"
                            icon={Map}
                            placeholder="Select District"
                            value={formData.districtName}
                            error={formError?.includes("District Name")}
                            onChange={(e) => onDistrictChange(e.target.value)}
                            options={districts.map(d => ({ label: d.name, value: d.name }))}
                        />

                        <FormSelect
                            label="Taluka Name"
                            icon={MapPin}
                            placeholder="Select Taluka"
                            value={formData.talukaName}
                            error={formError?.includes("Taluka Name")}
                            onChange={(e) => onChange({ ...formData, talukaName: e.target.value })}
                            options={modalTalukas.map(t => ({ label: t.name, value: t.name }))}
                        />
                    </div>

                    <FormInput
                        label="Census Code"
                        icon={Hash}
                        placeholder="Max 6 digits"
                        maxLength={6}
                        value={formData.censusCode}
                        error={formError?.includes("Census Code")}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            onChange({ ...formData, censusCode: val });
                        }}
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

