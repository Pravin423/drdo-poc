import { MapPin, Map, Hash, Save } from "lucide-react";
import { FormModal, FormHeader, FormError, FormInput, FormActions } from "@/components/common/FormUI";

export default function EditDistrictModal({
    isOpen,
    onClose,
    formData,
    onChange,
    onSave,
    formError,
}) {
    return (
        <FormModal isOpen={isOpen} onClose={onClose}>
            <FormHeader 
                title="Edit District" 
                subtitle="Update existing district details" 
                icon={MapPin} 
                onClose={onClose} 
            />

            <div className="p-8">
                <FormError error={formError} />

                <div className="space-y-6">
                    <FormInput
                        label="District Name"
                        icon={Map}
                        placeholder="e.g. North Goa"
                        maxLength={100}
                        value={formData.name}
                        error={formError?.includes("District Name")}
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

