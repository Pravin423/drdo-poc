import { useState } from "react";
import {
    FormModal,
    FormHeader,
    FormInput,
    FormTextArea,
    FormActions,
    FormInfo,
    FormError
} from "./common/FormUI";
import {
    Activity,
    Calendar,
    Eye,
    FileText,
    Hash,
    Tag,
    User,
    Plus,
    Edit3,
    CheckCircle2,
    Power
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Add Modal ────────────────────────────────────────────────────────────────

export function AddVerticalModal({ open, onClose, formData, setFormData, onSubmit, isSubmitting, formError }) {
    return (
        <FormModal isOpen={open} onClose={onClose} maxWidth="max-w-2xl">
            <FormHeader 
                title="Add Vertical" 
                subtitle="Create a new project domain" 
                icon={Plus} 
                onClose={onClose} 
            />
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 overscroll-contain transform-gpu">
                <FormError error={formError} />
                
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            label="Vertical Name"
                            icon={Tag}
                            placeholder="e.g. Health & Wellness"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <FormInput
                            label="Vertical Code"
                            icon={Hash}
                            placeholder="e.g. HW-01"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            required
                        />
                        <FormInput
                            label="Start Date"
                            type="date"
                            icon={Calendar}
                            value={formData.start}
                            onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                            required
                        />
                        <FormInput
                            label="End Date"
                            type="date"
                            icon={Calendar}
                            value={formData.end}
                            onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                            required
                        />
                    </div>
                    
                    <FormTextArea
                        label="Description"
                        icon={FileText}
                        placeholder="Provide detailed information about this vertical..."
                        value={formData.desc}
                        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                        required
                    />

                    <FormActions 
                        onCancel={onClose} 
                        onConfirm={onSubmit} 
                        isLoading={isSubmitting} 
                        confirmText="Create Vertical"
                        confirmIcon={CheckCircle2}
                    />
                </div>
            </div>
        </FormModal>
    );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

export function EditVerticalModal({ open, onClose, formData, setFormData, onSubmit, isSubmitting, formError }) {
    return (
        <FormModal isOpen={open} onClose={onClose} maxWidth="max-w-2xl">
            <FormHeader 
                title="Edit Vertical" 
                subtitle={formData.name || "Update vertical details"} 
                icon={Edit3} 
                onClose={onClose} 
            />
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 overscroll-contain transform-gpu">
                <FormError error={formError} />
                
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            label="Vertical Name"
                            icon={Tag}
                            placeholder="e.g. Health & Wellness"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <FormInput
                            label="Vertical Code"
                            icon={Hash}
                            placeholder="e.g. HW-01"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            required
                        />
                        <FormInput
                            label="Start Date"
                            type="date"
                            icon={Calendar}
                            value={formData.start}
                            onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                            required
                        />
                        <FormInput
                            label="End Date"
                            type="date"
                            icon={Calendar}
                            value={formData.end}
                            onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                            required
                        />
                    </div>
                    
                    <FormTextArea
                        label="Description"
                        icon={FileText}
                        placeholder="Provide detailed information about this vertical..."
                        value={formData.desc}
                        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                        required
                    />

                    <FormActions 
                        onCancel={onClose} 
                        onConfirm={onSubmit} 
                        isLoading={isSubmitting} 
                        confirmText="Update Vertical"
                        confirmIcon={CheckCircle2}
                    />
                </div>
            </div>
        </FormModal>
    );
}

// ─── View Modal ───────────────────────────────────────────────────────────────

export function ViewVerticalModal({ open, onClose, data, onStatusToggle }) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleToggle = async () => {
        if (!data) return;
        setIsUpdating(true);
        // Add a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 600));
        await onStatusToggle(data.id, data.status);
        setIsUpdating(false);
    };

    return (
        <FormModal isOpen={open} onClose={onClose} maxWidth="max-w-2xl">
            <FormHeader 
                title="Vertical Details" 
                subtitle="Domain Information & Status" 
                icon={Eye} 
                onClose={onClose} 
            />
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 overscroll-contain transform-gpu">
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInfo label="Vertical Name" value={data?.name} icon={Tag} />
                        <FormInfo label="Vertical Code" value={data?.code} icon={Hash} />
                        <FormInfo label="Start Date" value={data?.start} icon={Calendar} />
                        <FormInfo label="End Date" value={data?.end} icon={Calendar} />
                        <FormInfo label="Created By" value={data?.createdBy} icon={User} />
                        
                        {/* Status Section */}
                        <div className="p-5 rounded-[28px] bg-slate-50/50 border border-slate-100 transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 group flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1.5 ml-1">
                                    <Activity className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#3b52ab] transition-colors" />
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#3b52ab] transition-colors">Vertical Status</p>
                                </div>
                                <div className="flex items-center gap-2 ml-1">
                                    <div className={`w-2 h-2 rounded-full ${data?.status ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                    <p className={`text-[15px] font-black ${data?.status ? 'text-emerald-600' : 'text-slate-500'}`}>
                                        {data?.status ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                            </div>
                            
                            <button
                                onClick={handleToggle}
                                disabled={isUpdating}
                                className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 border shadow-sm flex items-center gap-2 ${
                                    data?.status 
                                    ? "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100" 
                                    : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
                                }`}
                            >
                                {isUpdating ? (
                                    <div className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                ) : (
                                    <Power size={12} />
                                )}
                                {data?.status ? "Deactivate" : "Activate"}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</p>
                        <div className="p-6 rounded-[32px] bg-slate-50/50 border border-slate-100 text-[15px] font-medium text-slate-700 leading-relaxed min-h-[120px]">
                            {data?.desc || "No description provided."}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={onClose}
                            className="px-10 py-4 text-[15px] font-bold text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all duration-300 active:scale-[0.98]"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </FormModal>
    );
}
