import { Eye } from "lucide-react";
import { FormModal, FormHeader, FormInfo, FormActions } from "@/components/common/FormUI";

export default function ViewVillageModal({ isOpen, onClose, villageDetails, isLoading, viewError, districts, talukasOptions }) {
    const villageName = villageDetails?.villageName || villageDetails?.name || villageDetails?.village_name || villageDetails?.village || "N/A";
    const talukaName = villageDetails?.talukaName || villageDetails?.taluka_name || villageDetails?.taluka?.name || talukasOptions?.find((t) => t.id == (villageDetails?.taluka_id || villageDetails?.talukaID))?.name || "N/A";
    const districtName = villageDetails?.districtName || villageDetails?.district_name || villageDetails?.district?.name || districts?.find((d) => d.id == (villageDetails?.district_id || villageDetails?.districtID))?.name || "N/A";
    const censusCode = villageDetails?.censusCode || villageDetails?.census_code || "N/A";

    return (
        <FormModal isOpen={isOpen} onClose={onClose}>
            <FormHeader 
                title="Village Details" 
                subtitle="Detailed information about the village" 
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
                ) : villageDetails && (
                    <div className="grid grid-cols-1 gap-4">
                        <FormInfo label="Village Name" value={villageName} />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <FormInfo label="Census Code" value={censusCode} />
                            <FormInfo 
                                label="Status" 
                                value={
                                    villageDetails.status === 1 || villageDetails.status === "1" || typeof villageDetails.status === "undefined"
                                        ? "Active" 
                                        : "Inactive"
                                } 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormInfo label="Taluka" value={talukaName} />
                            <FormInfo label="District" value={districtName} />
                        </div>
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

