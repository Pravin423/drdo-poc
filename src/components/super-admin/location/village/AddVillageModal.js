import { MapPin, Tag, Hash, Map, CheckCircle2 } from "lucide-react";
import { FormModal, FormHeader, FormError, FormInput, FormSelect, FormActions } from "@/components/common/FormUI";

export default function AddVillageModal({
    isOpen,
    onClose,
    formData,
    onChange,
    onConfirm,
    formError,
    isSubmitting,
    districts,
    modalTalukas,
    onDistrictChange,
}) {
    return (
        <FormModal isOpen={isOpen} onClose={onClose}>
            <FormHeader 
                title="Add New Village" 
                subtitle="Create a new village entry" 
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
                            value={formData.districtID}
                            error={formError?.includes("District")}
                            onChange={(e) => onDistrictChange(e.target.value)}
                            options={districts.map(d => ({ label: d.name, value: d.id }))}
                        />

                        <FormSelect
                            label="Taluka Name"
                            icon={MapPin}
                            placeholder={formData.districtID ? "Select Taluka" : "Select District first"}
                            value={formData.talukaID}
                            error={formError?.includes("Taluka")}
                            disabled={!formData.districtID}
                            onChange={(e) => onChange({ ...formData, talukaID: e.target.value })}
                            options={modalTalukas.map(t => ({ label: t.name, value: t.id }))}
                        />
                    </div>

                    <FormInput
                        label="Census Code"
                        icon={Hash}
                        placeholder="e.g. 627023"
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
                    onConfirm={onConfirm} 
                    confirmIcon={CheckCircle2}
                    confirmText={isSubmitting ? "Submitting..." : "Confirm & Save"}
                />
            </div>
        </FormModal>
    );
}

