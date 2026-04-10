import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useBannerStore } from "../../../stores/bannerStore";
import FormHeader from "../../molecules/FormHeader";
import FormField from "../../molecules/FormField";
import { validateBannerTwoForm, type BannerTwoFormData, type validationErrors } from "../../../components/validations/bannerTwoValidation";
import type { FieldConfig } from "../../../types/common";




const bannerTwoFields: FieldConfig[] = [
  { name: "title", label: "Title", type: "text", placeholder: "Enter title...", required: true },
  { name: "subtitle", label: "Sub Title", type: "text", placeholder: "Enter subtitle...", required: true },
  { name: "description", label: "Description", type: "textarea", placeholder: "Enter description...", required: true },
  { name: "buttonName", label: "Button Name", type: "text", placeholder: "Enter button name...", required: true },
  { name: "buttonUrl", label: "Button URL", type: "text", placeholder: "Enter button URL...", required: true },
  { name: "imageone", label: "Image One", type: "file", required: true },
  { name: "imagetwo", label: "Image Two", type: "file", required: true },
  { name: "imagethree", label: "Image Three", type: "file", required: true },
];

const BannerTwoForm: React.FC = () => {
  const { banner,
    fetchBanner,
    updateBanner } = useBannerStore();

  const [formData, setFormData] = useState<BannerTwoFormData>({
    title: "",
    subtitle: "",
    description: "",
    buttonName: "",
    buttonUrl: "",
    imageone: null,
    imagetwo: null,
    imagethree: null,
  });

  const [errors, setErrors] = useState<validationErrors>({});
  const [previewOne, setPreviewOne] = useState<string | null>('/preview-image.jpg');
  const [previewTwo, setPreviewTwo] = useState<string | null>('/preview-image.jpg');
  const [previewThree, setPreviewThree] = useState<string | null>('/preview-image.jpg');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invalidImageErrors, setInvalidImageErrors] = useState<{
    imageone?: string;
    imagetwo?: string;
    imagethree?: string;
  }>({});
  const [invalidImages, setInvalidImages] = useState<{
    imageone?: boolean;
    imagetwo?: boolean;
    imagethree?: boolean;
  }>({});


  useEffect(() => {
    fetchBanner();
  }, []);

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.home_page.banner_two.title,
        subtitle: banner.home_page.banner_two.subtitle,
        description: banner.home_page.banner_two.description,
        buttonName: banner.home_page.banner_two.buttonName,
        buttonUrl: banner.home_page.banner_two.buttonUrl,
        imageone: null,
        imagetwo: null,
        imagethree: null,
      })
      setPreviewOne(banner.home_page.banner_two.imageone ? `http://localhost:5000/${banner.home_page.banner_two.imageone}` : '/preview-image.jpg');
      setPreviewTwo(banner.home_page.banner_two.imagetwo ? `http://localhost:5000/${banner.home_page.banner_two.imagetwo}` : '/preview-image.jpg');
      setPreviewThree(banner.home_page.banner_two.imagethree ? `http://localhost:5000/${banner.home_page.banner_two.imagethree}` : '/preview-image.jpg');
    }
  }, [banner]);

  const handleChange = (name: keyof BannerTwoFormData, value: string | File | null) => {

    if (value instanceof File) {

      if (["image/jpeg", "image/png", "image/webp"].includes(value.type)) {

        setFormData(prev => ({ ...prev, [name]: value }));

        setInvalidImages(prev => ({ ...prev, [name]: false }));


        if (name === "imageone") setPreviewOne(URL.createObjectURL(value));
        if (name === "imagetwo") setPreviewTwo(URL.createObjectURL(value));
        if (name === "imagethree") setPreviewThree(URL.createObjectURL(value));

        setInvalidImageErrors(prev => ({ ...prev, [name]: undefined }));
        setErrors(prev => ({ ...prev, [name]: undefined }));

      } else {

        setFormData(prev => ({ ...prev, [name]: null }));


        setInvalidImages(prev => ({ ...prev, [name]: true }));

        setInvalidImageErrors(prev => ({
          ...prev,
          [name]: "Only JPG, PNG, or WEBP images are allowed"
        }));


        if (name === "imageone") setPreviewOne('/preview-image.jpg');
        if (name === "imagetwo") setPreviewTwo('/preview-image.jpg');
        if (name === "imagethree") setPreviewThree('/preview-image.jpg');


        setTimeout(() => {
          setInvalidImageErrors(prev => ({ ...prev, [name]: undefined }));
        }, 5000);
      }

      return;
    }

    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    const fieldErrors = validateBannerTwoForm(updatedForm, true);

    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors[name]
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let validationErrors = validateBannerTwoForm(formData, true);


    if (
      invalidImages.imageone ||
      invalidImages.imagetwo ||
      invalidImages.imagethree
    ) {
      setErrors({
        imageone: invalidImages.imageone ? "Invalid image selected" : undefined,
        imagetwo: invalidImages.imagetwo ? "Invalid image selected" : undefined,
        imagethree: invalidImages.imagethree ? "Invalid image selected" : undefined,
      });
      return;
    }



    if (!formData.imageone && !banner?.home_page?.banner_two?.imageone) {
      validationErrors.imageone = "Image is required";
    } if (!formData.imagetwo && !banner?.home_page?.banner_two?.imagetwo) {
      validationErrors.imagetwo = "Image is required";
    }
    if (!formData.imagethree && !banner?.home_page?.banner_two?.imagethree) {
      validationErrors.imagethree = "Image is required";
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
    });

    if (!result.isConfirmed) return;

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("type", "banner_two");
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("description", formData.description);
      data.append("buttonName", formData.buttonName);
      data.append("buttonUrl", formData.buttonUrl);

      if (formData.imageone) data.append("imageone", formData.imageone);
      if (formData.imagetwo) data.append("imagetwo", formData.imagetwo);
      if (formData.imagethree) data.append("imagethree", formData.imagethree);

      const bannerId = banner?._id || undefined;
      await updateBanner(bannerId, data);

      Swal.fire({
        icon: "success",
        title: "Banner Updated Successfully"
      });

    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div >
      <FormHeader managementName="" addButtonLink="" type="" />

      <form onSubmit={handleSubmit} noValidate className="bg-white p-6 rounded-xl shadow space-y-6">

        {bannerTwoFields
          .filter((field) => field.type !== "file")
          .map((field) => (
            <FormField
              key={field.name}
              field={field}
              isRequired={true}
              value={((formData as any)?.[field.name] || "")}
              onChange={(e: any) => {
                const val = e.target.value;
                handleChange(field.name as keyof BannerTwoFormData, val);
              }}
              error={errors[field.name as keyof validationErrors]}
            />
          ))}


        <div className="flex gap-6">
          {bannerTwoFields
            .filter((field) => field.type === "file")
            .map((field) => (
              <div key={field.name} className="w-1/3">
                <FormField
                  field={field}
                  isRequired={true}
                  value={undefined}
                  onChange={(e: any) => {
                    const val = e.target.files?.[0] || null;
                    handleChange(field.name as keyof BannerTwoFormData, val);

                    e.target.value = "";
                  }}
                  error={
                    invalidImageErrors[field.name as keyof typeof invalidImageErrors] ||
                    errors[field.name as keyof validationErrors]
                  }
                />
              </div>
            ))}
        </div>

        <div className="flex gap-6 ">
          <div className="w-1/3">
            {previewOne && (
              <img src={previewOne} className="w-32 h-32 object-cover rounded" alt="preview1" />
            )}
          </div>

          <div className="w-1/3">
            {previewTwo && (
              <img src={previewTwo} className="w-32 h-32 object-cover rounded" alt="preview2" />
            )}
          </div>

          <div className="w-1/3">
            {previewThree && (
              <img src={previewThree} className="w-32 h-32 object-cover rounded" alt="preview3" />
            )}
          </div>

        </div>


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
  )
}

export default BannerTwoForm;