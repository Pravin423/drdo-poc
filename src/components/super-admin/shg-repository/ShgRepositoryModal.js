import { 
  FormModal, FormHeader, FormInput, FormSelect, FormActions 
} from "../../common/FormUI";
import { Aperture, User, Phone, MapPin } from "lucide-react";

export default function ShgRepositoryModal({
  isOpen,
  onClose,
  modalMode,
  formData,
  handleChange,
  handleSubmit,
  isSubmitting,
  districts,
  talukas,
  villages
}) {
  return (
    <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <FormHeader 
        title={modalMode === "edit" ? "Edit SHG" : "Create SHG"} 
        subtitle={modalMode === "edit" ? "Update details of the Self Help Group" : "Register a new Self Help Group"} 
        icon={Aperture} 
        onClose={onClose} 
      />
      
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Group 1: General Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Group Information</h3>
              <p className="text-xs font-bold text-slate-500 mt-2 leading-relaxed">Core details and contact individual for the Self Help Group.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormInput
                  label="SHG Name"
                  name="shgName"
                  icon={Aperture}
                  placeholder="Enter SHG Name"
                  value={formData.shgName}
                  onChange={handleChange}
                  required
                />
              </div>

              <FormInput
                label="Contact Person Name"
                name="contactPersonName"
                icon={User}
                placeholder="Enter full name"
                value={formData.contactPersonName}
                onChange={handleChange}
                required
              />

              <FormInput
                label="Contact Person Mobile"
                name="contactPersonMobile"
                icon={Phone}
                type="tel"
                placeholder="10-digit mobile number"
                maxLength={10}
                value={formData.contactPersonMobile}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="h-px w-full bg-slate-100" />

          {/* Group 2: Location Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Location Settings</h3>
              <p className="text-xs font-bold text-slate-500 mt-2 leading-relaxed">Specify the geographic operational area for this group.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                label="District"
                name="district"
                icon={MapPin}
                value={formData.district}
                onChange={handleChange}
                required
                options={districts.map(d => ({ label: d.name, value: d.id }))}
              />

              <FormSelect
                label="Taluka"
                name="taluka"
                icon={MapPin}
                value={formData.taluka}
                onChange={handleChange}
                required
                disabled={!formData.district || talukas.length === 0}
                options={talukas.map(t => ({ label: t.name, value: t.id }))}
              />

              <FormSelect
                label="Village"
                name="village"
                icon={MapPin}
                value={formData.village}
                onChange={handleChange}
                required
                disabled={!formData.taluka || villages.length === 0}
                options={villages.map(v => ({ label: v.name, value: v.id }))}
              />

              {modalMode === "edit" && (
                <FormSelect
                  label="Status"
                  name="status"
                  icon={Aperture}
                  value={formData.status}
                  onChange={handleChange}
                  required
                  options={[
                    { label: "Active", value: 0 },
                    { label: "Deactive", value: 1 }
                  ]}
                />
              )}
            </div>
          </div>

          <FormActions 
            onCancel={onClose} 
            onConfirm={handleSubmit} 
            isLoading={isSubmitting} 
            confirmText={modalMode === "edit" ? "Update SHG" : "Register SHG"}
          />
        </form>
      </div>
    </FormModal>
  );
}
