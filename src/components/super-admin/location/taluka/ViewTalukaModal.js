import { Eye, MapPin } from "lucide-react";
import { FormModal, FormHeader, FormInfo, FormActions } from "@/components/common/FormUI";

export default function ViewTalukaModal({ isOpen, onClose, talukaDetails, isLoading, viewError, districts }) {
    const talukaName = talukaDetails?.talukaName || talukaDetails?.name || talukaDetails?.taluka_name || talukaDetails?.taluka || "N/A";
    const districtName = talukaDetails?.districtName || talukaDetails?.district_name || talukaDetails?.district?.name || districts?.find((d) => d.id == talukaDetails?.district_id)?.name || "N/A";
    const censusCode = talukaDetails?.censusCode || talukaDetails?.census_code || "N/A";

    return (
        <FormModal isOpen={isOpen} onClose={onClose}>
            <FormHeader 
                title="Taluka Details" 
                subtitle="Detailed information about the taluka" 
                icon={Eye} 
                onClose={onClose} 
            />

            <div className="p-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4" />
                        <p className="text-[15px] font-bold text-slate-500">Loading details...</p>
                    </div>
                ) : viewError ? (
                    <div className="text-center py-10 bg-rose-50 rounded-3xl border border-rose-100">
                        <p className="text-rose-500 font-bold">{viewError}</p>
                    </div>
                ) : talukaDetails && (
                    <div className="grid grid-cols-1 gap-4">
                        <FormInfo label="Taluka Name" value={talukaName} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormInfo label="Census Code" value={censusCode} />
                            <FormInfo 
                                label="Status" 
                                value={
                                    talukaDetails.status === 1 || talukaDetails.status === "1" || typeof talukaDetails.status === "undefined"
                                        ? "Active" 
                                        : "Inactive"
                                } 
                            />
                        </div>
                        <FormInfo label="Parent District" value={districtName} />
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

