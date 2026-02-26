export interface CouponFormData {

  code: string;
  description: string;

  discountType: string;
  discountValue: number;

  minOrderValue: number;
  maxDiscountAmount: number;

  usageLimit: number;

  startDate: string;
  endDate: string;

}

export interface CouponErrors {

  code?: string;
  description?: string;

  discountType?: string;
  discountValue?: string;

  startDate?: string;
  endDate?: string;

}

export const validateCouponForm = (
  data: CouponFormData
): CouponErrors => {

  const errors: CouponErrors = {};

  if (!data.code) {

    errors.code = "Coupon code required";

  }

  else if (data.code.startsWith(" ")) {

    errors.code = "Cannot start with space";

  }

 else if (!/^[A-Z0-9]+$/.test(data.code)) {

    errors.code =
      "Only capital letters and numbers allowed";

  }

  if (!data.discountType)
    errors.discountType = "Discount type required";

  if (!data.discountValue)
    errors.discountValue = "Discount value required";
if (!data.description) {

  errors.description = "Description required";

}

else if (data.description.trim().length < 10) {

  errors.description =
    "Description must be at least 10 characters";

}



    if (!data.startDate)
    errors.startDate = "Start date required";

  if (!data.endDate)
    errors.endDate = "End date required";

  if (data.startDate && data.endDate) {

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (end <= start) {

      errors.endDate = "End date must be later than start date";

    }

  }

  return errors;


};
