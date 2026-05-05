import { 
  FormModal, FormHeader, FormInput, FormActions 
} from "../../common/FormUI";
import { UserPlus, User, Phone, Activity, Plus, Trash2, Users } from "lucide-react";

export default function ShgMemberAddModal({
  isOpen,
  onClose,
  shg,
  addMembersList,
  handleMemberChange,
  addMemberRow,
  removeMemberRow,
  handleSubmit,
  isAddingMember
}) {
  return (
    <FormModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <FormHeader 
        title="Add Members" 
        subtitle={`Adding members to SHG: ${shg?.name}`} 
        icon={UserPlus} 
        onClose={onClose} 
      />
      
      <div className="p-8">
        <form id="add-members-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="hidden md:grid md:grid-cols-[1fr_1fr_1fr_50px] gap-6 px-1 mb-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Member Name</label>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</label>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Designation</label>
            <div></div>
          </div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            {addMembersList.map((member, idx) => (
              <div 
                key={member.id} 
                className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_50px] gap-4 items-start bg-slate-50/50 p-4 rounded-[20px] border border-slate-100 group hover:border-indigo-200 hover:bg-white transition-all duration-300"
              >
                <FormInput
                  hideLabel
                  placeholder="Full Name"
                  icon={User}
                  value={member.member_name}
                  onChange={(e) => handleMemberChange(idx, "member_name", e.target.value)}
                  error={member.errors?.member_name}
                />
                
                <FormInput
                  hideLabel
                  placeholder="Mobile Number"
                  icon={Phone}
                  maxLength={10}
                  value={member.mobile_no}
                  onChange={(e) => handleMemberChange(idx, "mobile_no", e.target.value)}
                  error={member.errors?.mobile_no}
                />

                <FormInput
                  hideLabel
                  placeholder="Designation"
                  icon={Activity}
                  value={member.designation}
                  onChange={(e) => handleMemberChange(idx, "designation", e.target.value)}
                  error={member.errors?.designation}
                />

                <div className="flex justify-center pt-2">
                  {addMembersList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMemberRow(idx)}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={addMemberRow}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-[#3b52ab] hover:text-[#3b52ab] text-sm font-black uppercase tracking-wider text-slate-600 rounded-2xl transition-all shadow-sm active:scale-95"
            >
              <Plus size={18} />
              Add Row
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-[#3b52ab] text-[11px] font-black uppercase tracking-widest rounded-xl border border-indigo-100">
              <Users size={16} />
              {addMembersList.length} Member{addMembersList.length !== 1 ? 's' : ''}
            </div>
          </div>

          <FormActions 
            onCancel={onClose} 
            onConfirm={handleSubmit} 
            isLoading={isAddingMember} 
            confirmText="Save Members"
          />
        </form>
      </div>
    </FormModal>
  );
}
