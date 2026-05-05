import { Eye } from "lucide-react";
import { FormModal, FormHeader, FormInfo, FormActions } from "@/components/common/FormUI";

export default function ViewDistrictModal({ isOpen, onClose, districtData, isLoading }) {
    return (
        <FormModal isOpen={isOpen} onClose={onClose}>
            <FormHeader 
                title="District Details" 
                subtitle="Detailed information about the district" 
                icon={Eye} 
                onClose={onClose} 
            />

            <div className="p-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4" />
                        <p className="text-[15px] font-bold text-slate-500">Loading details...</p>
                    </div>
                ) : districtData?.error ? (
                    <div className="text-center py-10 bg-rose-50 rounded-3xl border border-rose-100">
                        <p className="text-rose-500 font-bold">{districtData.error}</p>
                    </div>
                ) : districtData && (
                    <div className="grid grid-cols-1 gap-4">
                        <FormInfo label="District ID" value={districtData.id} />
                        <FormInfo label="District Name" value={districtData.name} />
                        <FormInfo label="Census Code" value={districtData.censusCode} />
                    </div>
                )}

                <FormActions 
                    onCancel={onClose} 
                    onConfirm={onClose} 
                    confirmText="Close"
                    cancelText="Go Back"
                />
            </div>
        </FormModal>
    );
}

