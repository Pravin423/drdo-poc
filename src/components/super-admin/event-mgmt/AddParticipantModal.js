import React, { useState } from "react";
import { User, CheckCircle2 } from "lucide-react";
import {
    FormModal,
    FormHeader,
    FormInput,
    FormSelect,
    FormActions
} from "../../common/FormUI";

export default function AddParticipantModal({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        type: "",
        district: "",
        organization: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone || !formData.type || !formData.district) {
            alert("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            onSave(formData);
            setFormData({ name: "", email: "", phone: "", type: "", district: "", organization: "" });
            setIsSubmitting(false);
            onClose();
        }, 1000);
    };

    const typeOptions = [
        { value: "CRP", label: "CRP Member" },
        { value: "External", label: "External Participant" }
    ];

    const districtOptions = [
        { value: "North Goa", label: "North Goa" },
        { value: "South Goa", label: "South Goa" }
    ];

    return (
        <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
            <FormHeader 
                title="Add Participant" 
                subtitle="Registration Gateway" 
                icon={User} 
                onClose={onClose} 
            />

            <div className="p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormInput
                        label="Full Name *"
                        placeholder="Participant's full name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            label="Email *"
                            type="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            required
                        />
                        <FormInput
                            label="Phone *"
                            type="tel"
                            placeholder="+91 00000 00000"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormSelect
                            label="Participant Type *"
                            placeholder="Select type"
                            options={typeOptions}
                            value={formData.type}
                            onChange={(e) => handleChange("type", e.target.value)}
                            required
                        />
                        <FormSelect
                            label="District *"
                            placeholder="Select district"
                            options={districtOptions}
                            value={formData.district}
                            onChange={(e) => handleChange("district", e.target.value)}
                            required
                        />
                    </div>

                    <FormActions 
                        onCancel={onClose} 
                        onConfirm={handleSubmit} 
                        isLoading={isSubmitting} 
                        confirmText="Add to List"
                        confirmIcon={CheckCircle2}
                    />
                </form>
            </div>
        </FormModal>
    );
}
