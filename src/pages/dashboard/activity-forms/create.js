import ProtectedRoute from "../../../components/ProtectedRoute";
import DashboardLayout from "../../../components/DashboardLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Extracted Components
import { 
  FormHeader, 
  ActivityFormCard, 
  FormFieldsList, 
  FormModals 
} from "../../../components/super-admin/activity-form";

export default function CreateForm() {
  const router = useRouter();
  const [formName, setFormName] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([]);
  const isEditing = Boolean(router.query.id);

  useEffect(() => {
    const fetchFormDetails = async () => {
      if (!router.query.id) return;
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`/api/activity-form-details?id=${router.query.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const body = await response.json();
          if (body.data) {
            setFormName(body.data.form_name || "");
            setDescription(body.data.description || "");
          }
          if (body.fields) {
            setFields(body.fields);
          }
        }
      } catch (e) {
        console.error("Failed to fetch form details");
      }
    };
    fetchFormDetails();
  }, [router.query.id]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [isAddingField, setIsAddingField] = useState(false);
  const [addFieldConfirmOpen, setAddFieldConfirmOpen] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [fieldData, setFieldData] = useState({
    label: "",
    name: "",
    type: "text",
    is_required: false,
    options: ""
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState(null);
  const [isDeletingField, setIsDeletingField] = useState(false);

  const validateForm = () => {
    setFormError("");
    if (!formName.trim()) { setFormError("Form Name is required."); return false; }
    if (formName.length < 3) { setFormError("Form Name must be at least 3 characters."); return false; }
    if (!/^[a-zA-Z0-9\s\-]+$/.test(formName)) { setFormError("Form Name contains invalid characters."); return false; }
    return true;
  };

  const handleInitialSubmit = () => {
    if (validateForm()) {
      setSaveConfirmOpen(true);
    }
  };

  const confirmSave = async () => {
    if (!formName.trim()) return;

    setIsSubmitting(true);
    setSaveError("");

    try {
      const token = localStorage.getItem("authToken");
      const url = isEditing ? `/api/activity-form-update?id=${router.query.id}` : "/api/activity-forms";
      const method = "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form_name: formName,
          description: description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save activity form");
      }

      router.push("/dashboard/activity-forms/all");
    } catch (error) {
      console.error("Error saving form:", error);
      setSaveError(error.message || "An error occurred while saving the form.");
    } finally {
      setIsSubmitting(false);
      if (!saveError) setSaveConfirmOpen(false);
    }
  };

  const initiateAddField = () => {
    setFieldError("");
    if (!fieldData.label.trim() || !fieldData.name.trim() || !fieldData.type) {
      setFieldError("Please fill out Label, Name, and Type.");
      return;
    }
    
    if ((fieldData.type === 'dropdown' || fieldData.type === 'radio') && (!fieldData.options || !fieldData.options.trim())) {
      setFieldError("Please provide options for Dropdown/Radio fields (comma separated).");
      return;
    }

    setAddFieldConfirmOpen(true);
  };

  const confirmAddField = async () => {
    setIsAddingField(true);
    setAddFieldConfirmOpen(false);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/activity-form-add-field?id=${router.query.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: fieldData.label,
          name: fieldData.name,
          type: fieldData.type,
          is_required: fieldData.is_required ? 1 : 0,
          options: fieldData.type === 'dropdown' || fieldData.type === 'radio' ? fieldData.options : ""
        })
      });

      if (!response.ok) throw new Error("Failed to add field");

      const addedField = await response.json();
      
      const newId = addedField?.data?.id || addedField?.id;

      setFields(prev => [...prev, {
        id: newId,
        ...fieldData,
        is_required: fieldData.is_required ? 1 : 0
      }]);

      setFieldData({ label: "", name: "", type: "text", is_required: false, options: "" });
      setIsFieldModalOpen(false);
    } catch (err) {
      console.error("Error adding field:", err);
      setFieldError("An error occurred while adding the field.");
    } finally {
      setIsAddingField(false);
    }
  };

  const initiateDeleteField = (field) => {
    setFieldToDelete(field);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteField = async () => {
    if (!fieldToDelete) return;
    setIsDeletingField(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/activity-form-field-delete?id=${fieldToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Failed to delete field");

      setFields(prev => prev.filter(f => f.id !== fieldToDelete.id));
      setDeleteConfirmOpen(false);
      setFieldToDelete(null);
    } catch (err) {
      console.error("Error deleting field:", err);
      alert("Failed to delete field. Please try again.");
    } finally {
      setIsDeletingField(false);
    }
  };

  return (
    <ProtectedRoute allowedRole={["super-admin", "state-admin"]}>
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-6 p-4">

          <FormHeader isEditing={isEditing} />

          <ActivityFormCard 
            isEditing={isEditing}
            formName={formName}
            setFormName={setFormName}
            description={description}
            setDescription={setDescription}
            formError={formError}
            handleInitialSubmit={handleInitialSubmit}
            isSubmitting={isSubmitting}
            router={router}
          />

          <FormFieldsList 
            isEditing={isEditing}
            fields={fields}
            setIsFieldModalOpen={setIsFieldModalOpen}
            initiateDeleteField={initiateDeleteField}
          />

        </div>
      </DashboardLayout>

      <FormModals 
        saveConfirmOpen={saveConfirmOpen}
        setSaveConfirmOpen={setSaveConfirmOpen}
        saveError={saveError}
        isSubmitting={isSubmitting}
        confirmSave={confirmSave}
        isFieldModalOpen={isFieldModalOpen}
        setIsFieldModalOpen={setIsFieldModalOpen}
        isAddingField={isAddingField}
        fieldData={fieldData}
        setFieldData={setFieldData}
        fieldError={fieldError}
        initiateAddField={initiateAddField}
        confirmAddField={confirmAddField}
        addFieldConfirmOpen={addFieldConfirmOpen}
        setAddFieldConfirmOpen={setAddFieldConfirmOpen}
        deleteConfirmOpen={deleteConfirmOpen}
        setDeleteConfirmOpen={setDeleteConfirmOpen}
        isDeletingField={isDeletingField}
        fieldToDelete={fieldToDelete}
        confirmDeleteField={confirmDeleteField}
      />
    </ProtectedRoute>
  );
}
