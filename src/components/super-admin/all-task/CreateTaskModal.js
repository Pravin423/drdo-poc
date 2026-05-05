import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ListTodo, 
    X, 
    AlertCircle, 
    ChevronDown,
    FileText,
    Calendar,
    MapPin,
    UserCheck,
    Briefcase,
    Zap,
    LocateFixed,
    Layers,
    CheckCircle
} from "lucide-react";
import {
    FormModal,
    FormHeader,
    FormInput,
    FormSelect,
    FormActions,
    FormSection,
    FormError
} from "../../common/FormUI";

const TASK_TYPES = [
    { value: "SPECIAL", label: "SPECIAL (Manual Selection)" },
    { value: "REGULAR", label: "REGULAR (Auto Assignment)" }
];

const CreateTaskModal = memo(function CreateTaskModal({ formData, handleInputChange, handleCreateTask, handleClearForm, onClose, apiError }) {
    const [taskCreationData, setTaskCreationData] = useState({ forms: [], crps: [], verticals: [] });
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setDataLoading(true);
                const res = await fetch("/api/activity-form-list");
                const result = await res.json();
                const d = result?.data || {};
                setTaskCreationData({
                    forms: Array.isArray(d.forms) ? d.forms.map(f => ({ value: f.id, label: f.form_name })) : [],
                    crps: Array.isArray(d.crps) ? d.crps.map(c => ({ value: c.id, label: `${c.fullname} (${c.crp_id})` })) : [],
                    verticals: Array.isArray(d.verticals) ? d.verticals.map(v => ({ value: v.id, label: `${v.vertical_name} (${v.vertical_code})` })) : [],
                });
            } catch (err) {
                console.error("Failed to fetch task creation data", err);
            } finally {
                setDataLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <FormModal isOpen={true} onClose={onClose} maxWidth="max-w-4xl">
            <FormHeader 
                title="Assign Activity Task" 
                subtitle="Mission Deployment • Workforce Orchestration" 
                icon={ListTodo} 
                onClose={onClose} 
            />

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar overscroll-contain transform-gpu">
                <FormError error={apiError} />

                <div className="space-y-12">
                    {/* Section 1: Task Identity */}
                    <FormSection title="Task Identity" description="Core parameters and operational type." icon={Briefcase}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput 
                                label="Task Name *" 
                                name="taskName" 
                                icon={FileText} 
                                placeholder="e.g. Annual SHG Survey" 
                                value={formData.taskName} 
                                onChange={handleInputChange} 
                            />
                            <FormSelect 
                                label="Task Type *" 
                                name="taskType" 
                                icon={Zap} 
                                options={TASK_TYPES} 
                                value={formData.taskType} 
                                onChange={handleInputChange} 
                            />
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Objectives & Description</p>
                            <textarea 
                                name="taskDescription" 
                                value={formData.taskDescription} 
                                onChange={handleInputChange} 
                                placeholder="Detailed operational requirements..."
                                className="w-full bg-slate-50 border-2 border-transparent rounded-[1.5rem] px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#3b52ab]/20 focus:ring-4 focus:ring-[#3b52ab]/5 transition-all min-h-[100px] resize-none"
                            />
                        </div>
                    </FormSection>

                    <div className="h-px bg-slate-100" />

                    {/* Section 2: Timeline & Schema */}
                    <FormSection title="Timeline & Payload" description="Set schedule and reporting structure." icon={Layers}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput 
                                label="Execution Start *" 
                                name="startDate" 
                                type="date" 
                                icon={Calendar} 
                                value={formData.startDate} 
                                onChange={handleInputChange} 
                            />
                            <FormInput 
                                label="Deadline Date *" 
                                name="endDate" 
                                type="date" 
                                icon={Calendar} 
                                value={formData.endDate} 
                                onChange={handleInputChange} 
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormSelect 
                                label="Activity Form *" 
                                name="activityForm" 
                                icon={Layers} 
                                options={taskCreationData.forms} 
                                value={formData.activityForm} 
                                onChange={handleInputChange} 
                                placeholder={dataLoading ? "Loading forms..." : "Select reporting schema..."}
                                disabled={dataLoading}
                            />
                            {formData.taskType === "SPECIAL" && (
                                <FormInput 
                                    label="Honorarium Budget (₹)" 
                                    name="honorariumAmount" 
                                    type="number" 
                                    icon={Briefcase} 
                                    placeholder="0.00" 
                                    value={formData.honorariumAmount} 
                                    onChange={handleInputChange} 
                                />
                            )}
                        </div>
                    </FormSection>

                    <div className="h-px bg-slate-100" />

                    {/* Section 3: Geographic Boundary */}
                    <FormSection title="Geographic Constraint" description="Define the operational radius." icon={MapPin}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormInput 
                                label="Center Latitude *" 
                                name="latitude" 
                                icon={LocateFixed} 
                                placeholder="15.2993" 
                                value={formData.latitude} 
                                onChange={handleInputChange} 
                            />
                            <FormInput 
                                label="Center Longitude *" 
                                name="longitude" 
                                icon={LocateFixed} 
                                placeholder="74.1240" 
                                value={formData.longitude} 
                                onChange={handleInputChange} 
                            />
                            <FormInput 
                                label="Geo-Radius (Meters) *" 
                                name="radius" 
                                icon={MapPin} 
                                placeholder="500" 
                                value={formData.radius} 
                                onChange={handleInputChange} 
                            />
                        </div>
                    </FormSection>

                    <div className="h-px bg-slate-100" />

                    {/* Section 4: Workforce Assignment */}
                    <FormSection title="Workforce Assignment" description="Dispatch to CRP or Vertical." icon={UserCheck}>
                        {formData.taskType === "SPECIAL" ? (
                            <FormSelect 
                                label="Target CRP Agent *" 
                                name="assignToCrp" 
                                icon={UserCheck} 
                                options={taskCreationData.crps} 
                                value={formData.assignToCrp} 
                                onChange={handleInputChange} 
                                placeholder={dataLoading ? "Loading workforce..." : "Choose agent for manual assignment..."}
                                disabled={dataLoading}
                            />
                        ) : (
                            <FormSelect 
                                label="Target Operational Vertical *" 
                                name="vertical_id" 
                                icon={Layers} 
                                options={taskCreationData.verticals} 
                                value={formData.vertical_id} 
                                onChange={handleInputChange} 
                                placeholder={dataLoading ? "Loading verticals..." : "Select vertical for auto-dispatch..."}
                                disabled={dataLoading}
                            />
                        )}
                    </FormSection>

                    <FormActions 
                        onCancel={onClose} 
                        onConfirm={handleCreateTask} 
                        isLoading={false} 
                        confirmText="Deploy Task" 
                        confirmIcon={CheckCircle} 
                    />
                </div>
            </div>
        </FormModal>
    );
});

export default CreateTaskModal;
