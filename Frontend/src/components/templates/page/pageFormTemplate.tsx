import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JoditEditor from "jodit-react";
import "jodit/es2021/jodit.min.css";
import { validatePageForm, type PageFormData, type ValidationErrors } from "../../validations/pageValidation";
import { usePageStore } from "../../../stores/pageStore";
import FormHeader from "../../molecules/FormHeader";
import FormField from "../../molecules/FormField";
import type { FieldConfig } from "../../../types/common";
import { toast } from "react-toastify";
import { handleError } from "../../utils/errorHandler";

const TYPE_OPTIONS = [
  { label: "Content Page", value: "content" },
  { label: "External URL Page", value: "url" },
];

const createSlug = (text: string) => text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

const PageFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchPageById, addPages, updatePages, checkDuplicatePage } = usePageStore();

  const editor = useRef(null);

  const joditConfig = useMemo(
    () => ({
      readonly: false,
      height: 400,
      placeholder: "Start typing content...",
      uploader: {
        insertImageAsBase64URI: true 
      },
    }),
    []
  );

  const pageFields: FieldConfig[] = [
    { name: "name", label: "Name", placeholder: "Enter Name", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", placeholder: "slug is automatically generated", disabled: true },
    { name: "type", label: "Type", type: "select" },
    { name: "url", label: "External URL", placeholder: "Enter the URL", type: "text", required: true },
  ];

  const [formData, setFormData] = useState<PageFormData>({
    name: "",
    slug: "",
    type: "content",
    description: "",
    url: "",
    isActive: true,
  });

  const [editorContent, setEditorContent] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadPage = async () => {
      try {
        const page = await fetchPageById(id);
        if (page) {
          setFormData({
            name: page.name || "",
            slug: page.slug || "",
            type: (page.type as "content" | "url") || "content",
            description: page.description || "",
            url: page.url || "",
            isActive: page.isActive ?? true,
          });
          setEditorContent(page.description || "");
        }
      } catch (err) {
        toast.error("Failed to load page data");
      }
    };
    loadPage();
  }, [id, fetchPageById]);

  const handleChange = (e: { target: { name: string; value: any; type?: string; checked?: boolean } }) => {
    const { name, value, type, checked } = e.target;
    const updatedSlug = name === "name" ? createSlug(value) : formData.slug;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        ...(name === "name" && { slug: updatedSlug }),
      };

      if (name === "type") {
        if (value === "content") updated.url = "";
        if (value === "url") {
          updated.description = "";
          setEditorContent("");
        }
      }

      const validation = validatePageForm(updated);
      setErrors((p) => ({
        ...p,
        [name]: validation[name as keyof ValidationErrors],
      }));

      return updated;
    });

    if (name === "name") {
      if (nameTimer.current) clearTimeout(nameTimer.current);
      nameTimer.current = setTimeout(async () => {
        if (updatedSlug) {
          const exists = await checkDuplicatePage(updatedSlug, id);
          if (exists) {
            setErrors((p) => ({ ...p, name: "Page name already exists" }));
          }
        }
      }, 500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const plainText = editorContent.replace(/<[^>]*>/g, "").trim();
  const hasImage = /<img[^>]*>/i.test(editorContent);
  const finalData: PageFormData = {
    ...formData,
    description: formData.type === "content" 
      ? (plainText || hasImage ? editorContent : "") 
      : "",
  };
  const validationErrors = validatePageForm(finalData);

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);

    const errorMessages = Object.values(validationErrors);
    if (errorMessages.length > 0) {
      toast.error(errorMessages[0]);
    }
    return;
  }

  try {
    setIsSubmitting(true);
    if (id) {
      await updatePages(id, finalData);
      toast.success("Page updated successfully");
    } else {
      await addPages(finalData);
      toast.success("Page added successfully");
    }
    navigate("/page");
  } catch (err: any) {
    handleError(err).forEach((m) => toast.error(m));
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="p-6">
      <FormHeader managementName="Pages" addButtonLink="/page" type={id ? "Edit" : "Add"} />

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mt-4">
        <div className="space-y-6">
          {pageFields.map((field) => {
            if (field.name === "url" && formData.type !== "url") return null;

            return (
              <div key={field.name} className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                <FormField
                  field={{
                    ...field,
                    label: "", 
                    options: field.name === "type" ? TYPE_OPTIONS : undefined,
                  }}
                  value={
                    field.name === "isActive"
                      ? formData.isActive
                      : formData[field.name as keyof PageFormData] ?? ""
                  }
                  onChange={handleChange}
                  error={errors[field.name as keyof ValidationErrors]}
                />
              </div>
            );
          })}

          
          {formData.type === "content" && (
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <div className={errors.description ? "border border-red-500 rounded" : ""}>
                <JoditEditor
                  ref={editor}
                  value={editorContent}
                  config={joditConfig}
                  onBlur={(newContent) => setEditorContent(newContent)}
                  onChange={(newContent) => {
                    if (newContent.length > 0) setErrors(prev => ({...prev, description: ""}));
                  }}
                />
              </div>
              {errors.description && (
                <span className="text-red-500 text-sm">{errors.description}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end mt-8">
          <button
            disabled={isSubmitting}
            className={`px-6 py-2 bg-indigo-600 text-white rounded transition-all ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700 active:scale-95"
            }`}
          >
            {isSubmitting ? "Saving..." : id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageFormTemplate;