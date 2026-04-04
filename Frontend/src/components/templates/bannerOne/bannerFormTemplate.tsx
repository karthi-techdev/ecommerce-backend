import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useBannerStore } from "../../../stores/bannerStore";
import FormHeader from "../../molecules/FormHeader";
import FormField from "../../molecules/FormField";
import { validateBannerOneForm, type BannerOneFormData, type validationErrors } from "../../../components/validations/bannerOneValidation";
import type { FieldConfig } from "../../../types/common";
import Swal from "sweetalert2";


const bannerOneFields: FieldConfig[] = [
  { name: "title", label: "Title", type: "text", placeholder: "Enter title...", required: true },
  { name: "subtitle", label: "Sub Title", type: "text", placeholder: "Enter subtitle...", required: true },
  { name: "description", label: "Description", type: "textarea", placeholder: "Enter description...", required: true },
  { name: "buttonName", label: "Button Name", type: "text", placeholder: "Enter button name...", required: true },
  { name: "buttonUrl", label: "Button URL", type: "text", placeholder: "Enter button URL...", required: true },
  { name: "image", label: "Image", type: "file", required: true },
];

const BannerOneUpdateForm: React.FC = () => {

  const { banner, fetchBanner, updateBanner } = useBannerStore();

  const [formData, setFormData] = useState<BannerOneFormData>({
    title: "",
    subtitle: "",
    description: "",
    buttonName: "",
    buttonUrl: "",
    image: null,
  });

  const [errors, setErrors] = useState<validationErrors>({});
  const [invalidImageError, setInvalidImageError] = useState<{ image?: string; }>({});
  const [preview, setPreview] = useState<string | null>('/preview-image.jpg');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invalidImage, setInvalidImage] = useState<{ image?: boolean }>({});

  useEffect(() => {
    fetchBanner();
  }, []);


  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.home_page.banner_one.title,
        subtitle: banner.home_page.banner_one.subtitle,
        description: banner.home_page.banner_one.description,
        buttonName: banner.home_page.banner_one.buttonName,
        buttonUrl: banner.home_page.banner_one.buttonUrl,
        image: null,
      });
      setPreview(banner.home_page.banner_one.image ? `http://localhost:5000/${banner.home_page.banner_one.image}` : '/preview-image.jpg');
    }
  }, [banner]);

  const handleChange = (name: keyof BannerOneFormData, value: string | File | null) => {


    if (value instanceof File) {
      if (["image/jpeg", "image/png", "image/webp"].includes(value.type)) {

        setFormData(prev => ({ ...prev, [name]: value }));

        setPreview(URL.createObjectURL(value));


        setInvalidImage(prev => ({ ...prev, [name]: false }));

        setInvalidImageError(prev => ({ ...prev, [name]: undefined }));
        setErrors(prev => ({ ...prev, [name]: undefined }));

      } else {

        setFormData(prev => ({ ...prev, [name]: null }));


        setInvalidImage(prev => ({ ...prev, [name]: true }));

        setErrors(prev => ({ ...prev, [name]: undefined }));

        setInvalidImageError(prev => ({
          ...prev,
          [name]: "Only JPG, PNG, or WEBP images are allowed"
        }));

        setPreview('/preview-image.jpg');

        setTimeout(() => {
          setInvalidImageError(prev => ({ ...prev, [name]: undefined }));
        }, 5000);

      }
      return;
    }


    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    const fieldErrors = validateBannerOneForm(updatedForm, true);

    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors[name]
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (invalidImage.image) {
      setErrors({
        image: "Invalid image selected"
      });
      return;
    }


    const validationErrors = validateBannerOneForm(formData, true);

    if (!formData.image && !banner?.home_page?.banner_one?.image) {
      validationErrors.image = "Image is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }


    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this banner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "No"
    })

    if (!result.isConfirmed) return;

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("type", "banner_one");
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("description", formData.description);
      data.append("buttonName", formData.buttonName);
      data.append("buttonUrl", formData.buttonUrl);
      if (formData.image) data.append("image", formData.image);

      const bannerId = banner?._id || undefined;
      await updateBanner(bannerId, data);
      await fetchBanner();

      Swal.fire({
        icon: "success",
        title: "Banner Updated Successfully"
      })
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <FormHeader managementName="" addButtonLink="" type="" />

      <form onSubmit={handleSubmit} noValidate className="bg-white p-6 rounded-xl shadow space-y-6">
        {bannerOneFields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            isRequired={true}
            value={field.type === "file" ? undefined : ((formData as any)?.[field.name] || "")}
            onChange={(e: any) => {
              const val = field.type === "file" ? e.target.files?.[0] || null : e.target.value;
              handleChange(field.name as keyof BannerOneFormData, val);

              if (field.type === "file") {
                e.target.value = "";
              }
            }}
            error={
              invalidImageError[field.name as keyof typeof invalidImageError] ||
              errors[field.name as keyof validationErrors]
            }
          />
        ))}

        {preview && <img src={preview} className="w-32 h-32 object-cover rounded" alt="preview" />}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-amber-600 text-white rounded-md disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BannerOneUpdateForm;