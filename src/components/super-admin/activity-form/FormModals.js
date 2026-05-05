import { motion, AnimatePresence } from "framer-motion";
import { 
    Save, 
    FilePlus2, 
    Trash2, 
    X,
    CheckCircle,
    Database,
    LayoutGrid,
    Info,
    AlertTriangle
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

export default function FormModals({
    saveConfirmOpen, setSaveConfirmOpen,
    saveError, isSubmitting, confirmSave,
    isFieldModalOpen, setIsFieldModalOpen,
    isAddingField, fieldData, setFieldData,
    fieldError, initiateAddField, confirmAddField,
    addFieldConfirmOpen, setAddFieldConfirmOpen,
    deleteConfirmOpen, setDeleteConfirmOpen,
    isDeletingField, fieldToDelete, confirmDeleteField
}) {
    return (
        <>
            {/* Save Confirmation Modal */}
            <ConfirmationModal 
                isOpen={saveConfirmOpen} 
                onClose={() => setSaveConfirmOpen(false)} 
                title="Synchronize Changes?" 
                message="Are you sure you want to persist these schema updates to the active activity form?" 
                type="warning" 
                onConfirm={confirmSave}
                isLoading={isSubmitting}
                confirmText="Yes, Sync Structure"
            />

            {/* Delete Field Confirmation */}
            <ConfirmationModal 
                isOpen={deleteConfirmOpen} 
                onClose={() => setDeleteConfirmOpen(false)} 
                title="Erase Field?" 
                message={`This will permanently remove the "${fieldToDelete?.label || 'selected'}" field and all associated data. This action is irreversible.`} 
                type="delete" 
                onConfirm={confirmDeleteField}
                isLoading={isDeletingField}
                confirmText="Erase Permanently"
            />

            {/* Add Field Modal (Construct UI) */}
            <FormModal isOpen={isFieldModalOpen} onClose={() => !isAddingField && setIsFieldModalOpen(false)} maxWidth="max-w-xl">
                <FormHeader title="Construct New Field" subtitle="Schema Expansion • Reporting Module" icon={LayoutGrid} onClose={() => setIsFieldModalOpen(false)} />
                
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar overscroll-contain transform-gpu">
                    <FormError error={fieldError} />
                    
                    <div className="space-y-10">
                        <FormSection title="Field Properties" description="Define label and identifier." icon={Database}>
                            <FormInput 
                                label="Display Label *" 
                                icon={LayoutGrid} 
                                placeholder="e.g., Total Attendance" 
                                value={fieldData.label} 
                                onChange={e => setFieldData(p => ({ ...p, label: e.target.value, name: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_') }))} 
                            />
                            <FormInput 
                                label="Internal Handle *" 
                                icon={Info} 
                                placeholder="e.g., total_attendance" 
                                value={fieldData.name} 
                                readOnly
                                className="bg-slate-50 border-transparent opacity-60"
                            />
                        </FormSection>

                        <div className="h-px bg-slate-100" />

                        <FormSection title="Input Logic" description="Data type and validation." icon={CheckCircle}>
                            <FormSelect 
                                label="Data Collection Type *" 
                                icon={CheckCircle} 
                                options={FIELD_TYPES} 
                                value={fieldData.type} 
                                onChange={e => setFieldData(p => ({ ...p, type: e.target.value }))} 
                            />

                            <div className="pt-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${fieldData.is_required ? "bg-[#3b52ab] border-[#3b52ab]" : "border-slate-200 bg-white group-hover:border-slate-300"}`}>
                                        <input type="checkbox" className="hidden" checked={fieldData.is_required} onChange={e => setFieldData(p => ({ ...p, is_required: e.target.checked }))} />
                                        {fieldData.is_required && <CheckCircle size={12} strokeWidth={4} className="text-white" />}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enforce as Mandatory</span>
                                </label>
                            </div>

                            <AnimatePresence>
                                {(fieldData.type === 'dropdown' || fieldData.type === 'radio') && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pt-4">
                                        <FormInput 
                                            label="Options Matrix" 
                                            icon={LayoutGrid} 
                                            placeholder="Option A, Option B, Option C" 
                                            value={fieldData.options} 
                                            onChange={e => setFieldData(p => ({ ...p, options: e.target.value }))} 
                                        />
                                        <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest ml-1">Comma-separated values required</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </FormSection>

                        <FormActions 
                            onCancel={() => setIsFieldModalOpen(false)} 
                            onConfirm={initiateAddField} 
                            isLoading={isAddingField} 
                            confirmText="Add to Schema" 
                            confirmIcon={Plus} 
                        />
                    </div>
                </div>
            </FormModal>

            {/* Addition Confirmation */}
            <ConfirmationModal 
                isOpen={addFieldConfirmOpen} 
                onClose={() => setAddFieldConfirmOpen(false)} 
                title="Append to Schema?" 
                message={`Are you ready to integrate the "${fieldData.label}" field into this reporting form structure?`} 
                type="success" 
                onConfirm={confirmAddField}
                isLoading={isAddingField}
                confirmText="Yes, Append Field"
            />
        </>
    );
}
