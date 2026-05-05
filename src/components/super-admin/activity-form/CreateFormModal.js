import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    X, 
    Save, 
    FilePlus2, 
    Trash2, 
    Plus, 
    Edit2, 
    AlertCircle,
    FileText,
    Settings2,
    LayoutGrid,
    CheckCircle,
    Info,
    Trash,
    Layers,
    Type,
    Hash,
    Calendar as CalendarIcon,
    ChevronDown,
    PlusCircle
} from "lucide-react";
import {
    FormModal,
    FormHeader,
    FormInput,
    FormSelect,
    FormActions,
    FormSection,
    FormError,
    FormCheckbox
} from "../../common/FormUI";
import ConfirmationModal from "../../common/ConfirmationModal";

const FIELD_TYPES = [
    { value: "text", label: "Text (Short)" },
    { value: "textarea", label: "Textarea (Long)" },
    { value: "number", label: "Numeric Value" },
    { value: "date", label: "Date Selection" },
    { value: "dropdown", label: "Dropdown Select" },
    { value: "radio", label: "Radio Selection" },
    { value: "checkbox", label: "Checkbox Toggle" },
    { value: "file", label: "Media Upload" }
];

export default function CreateFormModal({ isOpen, onClose, formId, onSaveSuccess }) {
    const [formName, setFormName] = useState("");
    const [description, setDescription] = useState("");
    const [fields, setFields] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Field state
    const [isAddingField, setIsAddingField] = useState(false);
    const [fieldError, setFieldError] = useState("");
    const [fieldData, setFieldData] = useState({
        label: "",
        name: "",
        type: "text",
        is_required: false,
        options: ""
    });

    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", type: "success" });

    const isEditing = Boolean(formId);

    useEffect(() => {
        if (isOpen && formId) {
            fetchFormDetails();
        } else if (isOpen && !formId) {
            setFormName("");
            setDescription("");
            setFields([]);
            setFormError("");
        }
    }, [isOpen, formId]);

    const fetchFormDetails = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`/api/activity-form-details?id=${formId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const body = await response.json();
                if (body.data) {
                    setFormName(body.data.form_name || "");
                    setDescription(body.data.description || "");
                }
                if (body.fields) setFields(body.fields);
            }
        } finally { setIsLoading(false); }
    };

    const handleSaveForm = async () => {
        if (!formName.trim()) { setFormError("Form name is required."); return; }
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("authToken");
            const url = isEditing ? `/api/activity-form-update?id=${formId}` : "/api/activity-forms";
            const response = await fetch(url, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ form_name: formName, description: description }),
            });
            
            if (!response.ok) throw new Error("Sync failed.");
            const result = await response.json();
            const newId = isEditing ? formId : result.data?.id;

            // If it's a new form and we have local fields, we need to sync them
            if (!isEditing && fields.length > 0) {
                for (const field of fields) {
                    await fetch(`/api/activity-form-add-field?id=${newId}`, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                        body: JSON.stringify({ ...field, is_required: field.is_required ? 1 : 0 })
                    });
                }
            }

            onSaveSuccess(newId);
            setConfirmModal({ 
                isOpen: true, 
                title: isEditing ? "Changes Saved" : "Form Integrated", 
                message: isEditing ? "Form structure has been successfully updated." : "New activity form has been initialized with all draft fields.", 
                type: "success" 
            });
        } catch (error) { 
            setFormError(error.message); 
        } finally { 
            setIsSubmitting(false); 
        }
    };

    const confirmAddField = async () => {
        if (!fieldData.label.trim()) { setFieldError("Label is required"); return; }
        
        if (isEditing) {
            setIsAddingField(true);
            try {
                const token = localStorage.getItem("authToken");
                const response = await fetch(`/api/activity-form-add-field?id=${formId}`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ ...fieldData, is_required: fieldData.is_required ? 1 : 0 })
                });
                if (!response.ok) throw new Error("Field sync failed.");
                const addedField = await response.json();
                setFields(prev => [...prev, { id: addedField.data?.id || Date.now(), ...fieldData }]);
            } catch (err) { 
                setFieldError(err.message); 
                return;
            } finally { 
                setIsAddingField(false); 
            }
        } else {
            // Local mode for new forms
            setFields(prev => [...prev, { id: Date.now(), ...fieldData }]);
        }
        
        setFieldData({ label: "", name: "", type: "text", is_required: false, options: "" });
        setFieldError("");
    };

    const handleDeleteField = async (fieldId) => {
        if (isEditing) {
            try {
                const token = localStorage.getItem("authToken");
                const response = await fetch(`/api/activity-form-field-delete?id=${fieldId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) setFields(prev => prev.filter(f => f.id !== fieldId));
            } catch (err) { console.error(err); }
        } else {
            setFields(prev => prev.filter(f => f.id !== fieldId));
        }
    };

    return (
        <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-5xl">
            <FormHeader 
                title={isEditing ? "Modify Activity Form" : "Create Activity Form"} 
                subtitle="Reporting Engine • Core Management" 
                icon={FilePlus2} 
                onClose={onClose} 
            />

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar overscroll-contain transform-gpu">
                <FormError error={formError} />

                <div className="space-y-12">
                    <FormSection title="Base Parameters" description="Define the form identity." icon={FileText}>
                        <FormInput 
                            label="Form Name *" 
                            icon={Edit2} 
                            placeholder="e.g., Monthly Field Operations Report" 
                            value={formName} 
                            onChange={e => setFormName(e.target.value)} 
                        />
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contextual Description</p>
                            <textarea 
                                value={description} 
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Purpose and usage instructions..."
                                className="w-full bg-slate-50 border-2 border-transparent rounded-[1.5rem] px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#3b52ab]/20 focus:ring-4 focus:ring-[#3b52ab]/5 transition-all min-h-[100px] resize-none shadow-sm shadow-slate-100"
                            />
                        </div>
                    </FormSection>

                    <div className="h-px bg-slate-100" />

                    <FormSection title="Schema configuration" description="Define reporting fields." icon={Layers}>
                        <div className="space-y-8">
                            {/* Draft / Existing Fields List */}
                            <div className="grid grid-cols-1 gap-3">
                                {fields.map((field, idx) => (
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={field.id || idx} 
                                        className="group p-5 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-between hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 font-black text-xs flex items-center justify-center border border-slate-100 group-hover:bg-[#3b52ab] group-hover:text-white transition-all">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800">{field.label}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <p className="text-[10px] font-bold text-[#3b52ab] uppercase tracking-widest bg-[#3b52ab]/5 px-2 py-0.5 rounded-md">{field.type}</p>
                                                    {field.is_required && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-md">Mandatory</p>}
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteField(field.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                            <Trash size={18} strokeWidth={2.5} />
                                        </button>
                                    </motion.div>
                                ))}
                                {fields.length === 0 && (
                                    <div className="p-12 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-3 bg-slate-50/30">
                                        <PlusCircle className="text-slate-200" size={32} />
                                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">No fields added to this schema.<br/>Start by constructing your first reporting field below.</p>
                                    </div>
                                )}
                            </div>

                            {/* Inline Construction UI */}
                            <div className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm space-y-6 relative overflow-hidden group/construct">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3b52ab]/5 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover/construct:scale-110 pointer-events-none" />
                                
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-[#3b52ab]/10 text-[#3b52ab] flex items-center justify-center">
                                        <Plus size={16} strokeWidth={3} />
                                    </div>
                                    <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Construct Reporting Field</h5>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormInput 
                                        label="Display Label *" 
                                        icon={Type} 
                                        placeholder="e.g., Participant Name" 
                                        value={fieldData.label} 
                                        onChange={e => setFieldData(p => ({ ...p, label: e.target.value, name: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_') }))} 
                                    />
                                    <FormSelect 
                                        label="Input Type *" 
                                        icon={Hash} 
                                        options={FIELD_TYPES} 
                                        value={fieldData.type} 
                                        onChange={e => setFieldData(p => ({ ...p, type: e.target.value }))} 
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group/check">
                                        <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all ${fieldData.is_required ? "bg-[#3b52ab] border-[#3b52ab] shadow-md shadow-[#3b52ab]/20" : "border-slate-200 bg-white group-hover/check:border-slate-300"}`}>
                                            <input type="checkbox" className="hidden" checked={fieldData.is_required} onChange={e => setFieldData(p => ({ ...p, is_required: e.target.checked }))} />
                                            {fieldData.is_required && <CheckCircle size={14} strokeWidth={4} className="text-white" />}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enforce as Mandatory</span>
                                    </label>

                                    <button 
                                        type="button"
                                        onClick={confirmAddField} 
                                        disabled={isAddingField}
                                        className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-lg shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {isAddingField ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={14} strokeWidth={3} />}
                                        Append Field
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {(fieldData.type === 'dropdown' || fieldData.type === 'radio') && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4 overflow-hidden">
                                            <FormInput 
                                                label="Options Matrix" 
                                                icon={Layers} 
                                                placeholder="Choice 1, Choice 2, Choice 3" 
                                                value={fieldData.options} 
                                                onChange={e => setFieldData(p => ({ ...p, options: e.target.value }))} 
                                            />
                                            <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest ml-1">Separate distinct options with commas</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <FormError error={fieldError} />
                            </div>
                        </div>
                    </FormSection>

                    <FormActions 
                        onCancel={onClose} 
                        onConfirm={handleSaveForm} 
                        isLoading={isSubmitting} 
                        confirmText={isEditing ? "Sync Structure" : "Register Form & Fields"} 
                        confirmIcon={CheckCircle} 
                    />
                </div>
            </div>

            <ConfirmationModal 
                isOpen={confirmModal.isOpen} 
                onClose={() => { setConfirmModal({ ...confirmModal, isOpen: false }); if (!isEditing) onClose(); }} 
                title={confirmModal.title} 
                message={confirmModal.message} 
                type={confirmModal.type} 
            />
        </FormModal>
    );
}
