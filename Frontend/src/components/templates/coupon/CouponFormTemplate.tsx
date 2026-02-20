import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormHeader from "../../molecules/FormHeader";
import FormField from "../../molecules/FormField";
import { useCouponStore } from "../../../stores/CouponStore";
import { useDebounce } from "../../hooks/useDebounce";
import axiosInstance from '../../../components/utils/axios';
import ImportedURL from '../../../common/urls';
const { API } = ImportedURL;



import {
  validateCouponForm,
  type CouponFormData,
  type CouponErrors,
} from "../../validations/couponValidation";
import type { FieldConfig } from "../../../types/common";

const leftFields: FieldConfig[] = [
  { name: "code", label: "Coupon Code", type: "text", required: true, placeholder: "Enter coupon code" },
  {
    name: "discountType",
    label: "Discount Type",
    type: "select",
    required: true,
    options: [
      { label: "Percentage", value: "percentage" },
      { label: "Flat", value: "flat" },
    ],
  },
  
{ name: "maxDiscountAmount", label: "Maximum Discount", type: "number", placeholder: "Enter max discount" },
  { name: "startDate", label: "Start Date", type: "date", required: true },
];

const rightFields: FieldConfig[] = [
  { name: "usageLimit", label: "Usage Limit", type: "number", placeholder: "Enter usage limit" },
   { name: "discountValue", label: "Discount Value", type: "number", required: true, placeholder: "Enter discount" },
 
  { name: "minOrderValue", label: "Minimum Order Amount", type: "number", placeholder: "Enter min order" },
  { name: "endDate", label: "End Date", type: "date", required: true },
];

const bottomField: FieldConfig = {
  name: "description",
  label: "Description",
  type: "textarea",
  required: true,
  placeholder: "Enter coupon description",
};

const CouponFormTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // coupon ID for edit
  const { addCoupon, updateCoupon, coupons } = useCouponStore();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<CouponFormData>({
    code: "",
    description: "",
    discountType: "",
    discountValue: 0,
    minOrderValue: 0,
    maxDiscountAmount: 0,
    usageLimit: 0,
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState<CouponErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedCode = useDebounce(formData.code, 500);
  const [duplicateError, setDuplicateError] = useState('');


useEffect(() => {
  if (!debouncedCode.trim()) return;

  const checkDuplicate = async () => {
    try {
      const res = await axiosInstance.get(API.checkDuplicateCoupon, {
        params: { code: debouncedCode.trim(), excludeId: id },
      });

      if (res.data.exists) {
        setDuplicateError("Code already exists");
        setErrors((prev) => ({ ...prev, code: "Code already exists" }));
      } else {
        setDuplicateError("");
        setErrors((prev) => {
          if (prev.code === "Code already exists") {
            return { ...prev, code: undefined };
          }
          return prev;
        });
      }
    } catch (err) {
      console.error("Failed to check code", err);
    }
  };

  checkDuplicate();
}, [debouncedCode, id]);





  // Fetch coupon data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const coupon = coupons.find(c => c._id === id);
      if (coupon) {
        setFormData({
          code: coupon.code,
          description: coupon.description || "",
          discountType: coupon.discountType,
          discountValue: coupon.discountValue || 0,
          minOrderValue: coupon.minOrderValue || 0,
          maxDiscountAmount: coupon.maxDiscountAmount || 0,
          usageLimit: coupon.usageLimit || 0,
          startDate: coupon.startDate
  ? new Date(coupon.startDate).toISOString().split("T")[0]
  : "",

endDate: coupon.endDate
  ? new Date(coupon.endDate).toISOString().split("T")[0]
  : "",

        });
      } else {
        toast.error("Coupon not found");
        navigate("/coupon");
      }
    }
  }, [isEditMode, id, coupons, navigate]);

const handleChange = (name: string, value: string | number) => {
  const numericFields = ["discountValue", "minOrderValue", "maxDiscountAmount", "usageLimit"];
  const updatedValue = numericFields.includes(name) && value !== "" ? Number(value) : value;

  setFormData((prev) => ({ ...prev, [name]: updatedValue }));

  const validationErrors = validateCouponForm({ ...formData, [name]: updatedValue });
  setErrors({
    ...errors,
    [name]: validationErrors[name as keyof CouponErrors] || "",
  });
};



  const handleSubmit = async (e: any) => {
  e.preventDefault();

  const validationErrors = validateCouponForm(formData);

  // Add duplicate error if exists
  if (duplicateError) {
    validationErrors.code = duplicateError;
  }

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  try {
    setIsSubmitting(true);
    if (isEditMode && id) {
      await updateCoupon(id, formData);
      toast.success("Coupon updated");
    } else {
      await addCoupon(formData);
      toast.success("Coupon added");
    }
    navigate("/coupon");
  } catch (error: any) {
    toast.error(error.message);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="p-6">
      <FormHeader managementName="" addButtonLink="/coupon" type={isEditMode ? "Edit" : "Add"} />

      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {leftFields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={(formData as any)[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                error={(errors as any)[field.name]}
              />
            ))}
          </div>

          <div className="space-y-4">
            {rightFields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={(formData as any)[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                error={(errors as any)[field.name]}
              />
            ))}
          </div>
        </div>

        <FormField
          field={bottomField}
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={errors.description}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponFormTemplate;
