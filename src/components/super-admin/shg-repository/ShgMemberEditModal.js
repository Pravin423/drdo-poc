import { 
  FormModal, FormHeader, FormInput, FormActions 
} from "../../common/FormUI";
import { User, Phone, Activity } from "lucide-react";

export default function ShgMemberEditModal({
  isOpen,
  onClose,
  editMemberData,
  setEditMemberData,
  handleSubmit,
  isUpdatingMember
}) {
  return (
    <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <FormHeader 
        title="Edit Member" 
        subtitle={editMemberData.member_name || "Update member details"} 
        icon={User} 
        onClose={onClose} 
      />
      
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Member Name"
            icon={User}
            placeholder="Full Name"
            value={editMemberData.member_name}
            onChange={(e) => setEditMemberData(prev => ({ ...prev, member_name: e.target.value }))}
            required
          />

          <FormInput
            label="Mobile Number"
            icon={Phone}
            placeholder="10-digit number"
            maxLength={10}
            value={editMemberData.mobile_no}
            onChange={(e) => setEditMemberData(prev => ({ ...prev, mobile_no: e.target.value }))}
            required
          />

          <FormInput
            label="Designation"
            icon={Activity}
            placeholder="Role (e.g., President)"
            value={editMemberData.designation}
            onChange={(e) => setEditMemberData(prev => ({ ...prev, designation: e.target.value }))}
            required
          />

          <FormActions 
            onCancel={onClose} 
            onConfirm={handleSubmit} 
            isLoading={isUpdatingMember} 
            confirmText="Save Changes"
          />
        </form>
      </div>
    </FormModal>
  );
}
