const LIVE = false;

const SITEURL = "https://example.com/";
const LIVEURL = LIVE ? SITEURL : "http://localhost:5000/";
const ROOTURL = `${LIVEURL}api/v1/`;
const FILEURL = LIVEURL;
const SETTINGS_ID = "68ad8844bfdf0cec7f623bc2";

const API = {
  // ---------- NewsLetter endpoints ----------
  addNewsLetter: `${ROOTURL}newsLetters/`,
  listNewsLetter: `${ROOTURL}newsLetters/`,
  getNewsLetter: `${ROOTURL}newsLetters/getNewsLetterById/`, // backend expect /newsLetters/:id
  updateNewsLetter: `${ROOTURL}newsLetters/updateNewsLetter/`, // backend expect /newsLetters/:id
  deleteNewsLetter: `${ROOTURL}newsLetters/softDeleteNewsLetter/`,
  // ---------------- FAQ endpoints ----------------
  addFaq: `${ROOTURL}admin/faqs/`,
  listFaq: `${ROOTURL}admin/faqs/`,
  getFaq: `${ROOTURL}admin/faqs/getFaqById/`,
  updateFaq: `${ROOTURL}admin/faqs/updateFaq/`,
  softDeleteFaq: `${ROOTURL}admin/faqs/softDeleteFaq/`,
  toggleStatusFaq: `${ROOTURL}admin/faqs/togglestatus/`,
  checkDuplicateFaq: `${ROOTURL}admin/faqs/check-duplicate`,
  restoreFaq: `${ROOTURL}admin/faqs/restore/`,
  permanantDeleteFaq: `${ROOTURL}admin/faqs/permanentDelete/`,
  trashFaq: `${ROOTURL}admin/faqs/trash`,
  faqStats: `${ROOTURL}admin/faqs/faqStats`,
  // Testimonial endpoints
  addTestimonial: `${ROOTURL}admin/testimonials/`,
  listTestimonial: `${ROOTURL}admin/testimonials/`,
  getTestimonialById: `${ROOTURL}admin/testimonials/getTestimonialById`,
  updateTestimonial: `${ROOTURL}admin/testimonials/updateTestimonial/`,
  deleteTestimonial: `${ROOTURL}admin/testimonials/softDelete/`,
  hardDeleteTestimonial: `${ROOTURL}admin/testimonials/permanentDelete`,
  toggleStatusTestimonial: `${ROOTURL}admin/testimonials/togglestatus`,

  // Category endpoints
  addCategory: `${ROOTURL}admin/categories/`,
  listCategory: `${ROOTURL}admin/categories/`,
  getCategory: `${ROOTURL}admin/categories/getCategoryById/`,
  updateCategory: `${ROOTURL}admin/categories/updateCategory/`,
  deleteCategory: `${ROOTURL}admin/categories/softDelete/`,
  toggleStatusCategory: `${ROOTURL}admin/categories/togglestatus/`,
  trashCategory: `${ROOTURL}admin/categories/trash`,
  permanentDeleteCategory: `${ROOTURL}admin/categories/permanentDelete/`,
  restoreCategory: `${ROOTURL}admin/categories/restore/`,
  categoryStats: `${ROOTURL}admin/categories/categoryStats`,
  mainCategory: `${ROOTURL}admin/categories/mainCategory`,
  subCategory: `${ROOTURL}admin/categories/subCategory/`,
  slugExist: `${ROOTURL}admin/categories/slugExist`,

  // Main Category endpoints
  listMainCategory: `${ROOTURL}admin/main-categories`,
  addMainCategory: `${ROOTURL}admin/main-categories`,
  getMainCategory: `${ROOTURL}admin/main-categories/`,
  updateMainCategory: `${ROOTURL}admin/main-categories/`,
  deleteMainCategory: `${ROOTURL}admin/main-categories/soft-delete/`,
  toggleMainCategoryStatus: `${ROOTURL}admin/main-categories/toggle-status/`,
  checkDuplicateMainCategory: `${ROOTURL}admin/main-categories/check-duplicate`,
  getTrashMainCategory: `${ROOTURL}admin/main-categories/trash`,
  restoreMainCategory: `${ROOTURL}admin/main-categories/restore/`,
  permanentDeleteMainCategory: `${ROOTURL}admin/main-categories/permanent-delete/`,
  activeMainCategory: `${ROOTURL}admin/main-categories//activeMainCategories`,
  listAllMainCategory: `${ROOTURL}admin/main-categories/list`,
  // ---------------- Brand endpoints ----------------
  addBrand: `${ROOTURL}brands/`,
  listBrand: `${ROOTURL}brands/`,
  getBrand: `${ROOTURL}brands/getBrandById/`,
  updateBrand: `${ROOTURL}brands/updateBrand/`,
  softDeleteBrand: `${ROOTURL}brands/softDeleteBrand/`,
  restoreBrand: `${ROOTURL}brands/restore`,
  hardDeleteBrand: `${ROOTURL}brands/permanentDelete`,
  toggleBrandStatus: `${ROOTURL}brands/togglestatus`,
  trashBrands: `${ROOTURL}brands/trash`,
  checkDuplicateBrand: `${ROOTURL}brands/check-duplicate`,
  //subcategory endpoints
  addSubCategory: `${ROOTURL}admin/subcategory/`,
  listSubCategory: `${ROOTURL}admin/subcategory/`,
  getSubCategoryById: `${ROOTURL}admin/subcategory/getSubCategoryById/`,
  updateSubCategory: `${ROOTURL}admin/subcategory/updateSubCategory/`,
  deleteSubCategory: `${ROOTURL}admin/subcategory/softDeleteSubCategory/`,
  hardDeleteSubCategory: `${ROOTURL}admin/subcategory/permanentDelete/`,
  restoreSubCategory: `${ROOTURL}admin/subcategory/restore/`,
  toggleStatusSubCategory: `${ROOTURL}admin/subcategory/togglestatus/`,
  checkDuplicateSubCategory: `${ROOTURL}admin/subcategory/check-duplicate`,
  listSubCategoryTrash: `${ROOTURL}admin/subcategory/trash/`,
  subCategoryByMainCategoryId: `${ROOTURL}admin/subcategory/softDeleteSubCategory/`,
  listActiveMainCategory: `${ROOTURL}admin/subcategory/activemain-categorylist`,
  //shipmentMethods endpoints
  addShipmentMethods: `${ROOTURL}admin/shipment-methods/`,
  listShipmentMethods: `${ROOTURL}admin/shipment-methods/`,
  getShipmentMethodsById: `${ROOTURL}admin/shipment-methods/getShipmentMethodById/`,
  updateShipmentMethods: `${ROOTURL}admin/shipment-methods/updateShipmentMethod/`,
  deleteShipmentMethods: `${ROOTURL}admin/shipment-methods/softDeleteShipmentMethod/`,
  toggleStatusShipmentMethods: `${ROOTURL}admin/shipment-methods/togglestatus/`,
  checkDuplicateShipmentMethods: `${ROOTURL}admin/shipment-methods/check-duplicate/`,
  // ---------------- Coupon endpoints ----------------

  addCoupon: `${ROOTURL}admin/coupon/`,
  listCoupon: `${ROOTURL}admin/coupon/`,
  getCoupon: `${ROOTURL}admin/coupon/`,
  updateCoupon: `${ROOTURL}admin/coupon/`,
  softDeleteCoupon: `${ROOTURL}admin/coupon/softDelete/`,
  restoreCoupon: `${ROOTURL}admin/coupon/restore/`,
  hardDeleteCoupon: `${ROOTURL}admin/coupon/permanentDelete/`,
  toggleCouponStatus: `${ROOTURL}admin/coupon/togglestatus/`,
  trashCoupon: `${ROOTURL}admin/coupon/trash`,
  checkDuplicateCoupon: `${ROOTURL}admin/coupon/check-code`,

  // Config Endpoints
  addConfig: `${ROOTURL}admin/config/`,
  listConfig: `${ROOTURL}admin/config/`,
  getConfigById: `${ROOTURL}admin/config/getConfigById/`,
  configStats: `${ROOTURL}admin/config/configStats`,
  updateConfig: `${ROOTURL}admin/config/editConfig/`,
  deleteConfig: `${ROOTURL}admin/config/deleteConfig/`,
  toggleConfigStatus: `${ROOTURL}admin/config/togglestatus/`,

  // Page endpoints
  addPage: `${ROOTURL}admin/page/`,
  listPage: `${ROOTURL}admin/page/`,
  getPageById: `${ROOTURL}admin/page/`,
  updatePage: `${ROOTURL}admin/page/`,
  deletePage: `${ROOTURL}admin/page/`,
  hardDeletePage: `${ROOTURL}admin/page/permanent/`,
  restorePage: `${ROOTURL}admin/page/restore/`,
  toggleStatusPage: `${ROOTURL}admin/page/togglestatus/`,
  checkDuplicatePage: `${ROOTURL}admin/page/check-duplicate`,
  listPageTrash: `${ROOTURL}admin/page/trash/`,

  // ---------------- Product endpoints ----------------
  addProduct: `${ROOTURL}products/`,
  listProduct: `${ROOTURL}products/`,
  getProductById: `${ROOTURL}products/getProductById/`,
  updateProduct: `${ROOTURL}products/updateProduct/`,
  softDeleteProduct: `${ROOTURL}products/softDelete/`,
  permanentDeleteProduct: `${ROOTURL}products/permanentDelete/`,
  restoreProduct: `${ROOTURL}products/restore/`,
  toggleProductStatus: `${ROOTURL}products/toggleStatus/`,
  trashProducts: `${ROOTURL}products/trash`,
  checkProductSlug: `${ROOTURL}products/checkSlugExist`,
};

const ImportedURL = { API, LIVEURL, FILEURL, SETTINGS_ID };
export default ImportedURL;
