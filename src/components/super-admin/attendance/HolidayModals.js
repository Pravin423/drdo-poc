import React from "react";
import { Tag, Calendar, Activity } from "lucide-react";
import { 
  FormModal, FormHeader, FormInput, FormSelect, FormActions, FormError 
} from "../../common/FormUI";

export const AddHolidayModal = ({ 
  isOpen, onClose, form, setForm, loading, error, onConfirm 
}) => {
  return (
    <FormModal isOpen={isOpen} onClose={onClose}>
      <FormHeader 
        title="Add New Holiday" 
        subtitle="Configure a new date in the calendar" 
        icon={Calendar} 
        onClose={onClose} 
      />
      <div className="p-8">
        <FormError error={error} />
        <div className="space-y-6">
          <FormInput 
            label="Holiday Name" 
            icon={Tag} 
            placeholder="e.g. Diwali Festival" 
            value={form.holiday_name} 
            onChange={e => setForm(p => ({ ...p, holiday_name: e.target.value }))} 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormInput 
              label="Start Date" 
              type="date" 
              icon={Calendar} 
              value={form.start_date} 
              onChange={e => setForm(p => ({
                ...p,
                start_date: e.target.value,
                end_date: form.end_date || e.target.value,
              }))} 
            />
            <FormInput 
              label="End Date" 
              type="date" 
              icon={Calendar} 
              value={form.end_date} 
              min={form.start_date} 
              onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} 
            />
          </div>
          <FormSelect 
            label="Status" 
            icon={Activity} 
            value={form.status} 
            onChange={e => setForm(p => ({ ...p, status: e.target.value }))} 
            options={[
              { label: "Active Entry", value: "active" },
              { label: "Inactive / Archive", value: "deactive" }
            ]}
          />
        </div>
        <FormActions 
          onCancel={onClose} 
          onConfirm={onConfirm} 
          isLoading={loading} 
        />
      </div>
    </FormModal>
  );
};

export const EditHolidayModal = ({ 
  isOpen, onClose, form, setForm, loading, error, onConfirm 
}) => {
  return (
    <FormModal isOpen={isOpen} onClose={onClose}>
      <FormHeader 
        title="Edit Holiday" 
        subtitle="Update the selected holiday details" 
        icon={Calendar} 
        onClose={onClose} 
      />
      <div className="p-8">
        <FormError error={error} />
        <div className="space-y-6">
          <FormInput 
            label="Holiday Name" 
            icon={Tag} 
            placeholder="e.g. Diwali Festival" 
            value={form.holiday_name} 
            onChange={e => setForm(p => ({ ...p, holiday_name: e.target.value }))} 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormInput 
              label="Start Date" 
              type="date" 
              icon={Calendar} 
              value={form.start_date} 
              onChange={e => setForm(p => ({
                ...p,
                start_date: e.target.value,
                end_date: form.end_date < e.target.value ? e.target.value : form.end_date,
              }))} 
            />
            <FormInput 
              label="End Date" 
              type="date" 
              icon={Calendar} 
              value={form.end_date} 
              min={form.start_date} 
              onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} 
            />
          </div>
          <FormSelect 
            label="Status" 
            icon={Activity} 
            value={form.status} 
            onChange={e => setForm(p => ({ ...p, status: e.target.value }))} 
            options={[
              { label: "Active Entry", value: "active" },
              { label: "Inactive / Archive", value: "deactive" }
            ]}
          />
        </div>
        <FormActions 
          onCancel={onClose} 
          onConfirm={onConfirm} 
          isLoading={loading} 
          confirmText="Save Changes"
        />
      </div>
    </FormModal>
  );
};
