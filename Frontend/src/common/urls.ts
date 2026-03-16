const LIVE = false;

const SITEURL = "https://example.com/";
const LIVEURL = LIVE ? SITEURL : "http://localhost:5000/";
const ROOTURL = `${LIVEURL}api/v1/`;
const FILEURL = LIVEURL;
const SETTINGS_ID = "68ad8844bfdf0cec7f623bc2";

const API = {
  // ---------- NewsLetter endpoints ----------
  addNewsLetter: `${ROOTURL}admin/newsLetters/`,
  listNewsLetter: `${ROOTURL}admin/newsLetters/`,
  getNewsLetter: `${ROOTURL}admin/newsLetters/getNewsLetterById/`, // backend expect /newsLetters/:id
  updateNewsLetter: `${ROOTURL}admin/newsLetters/updateNewsLetter/`, // backend expect /newsLetters/:id
  deleteNewsLetter: `${ROOTURL}admin/newsLetters/softDeleteNewsLetter/`,
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
  activeMainCategory: `${ROOTURL}admin/main-categories/activeMainCategories`,
  listAllMainCategory: `${ROOTURL}admin/main-categories`,
  
  // ---------------- Brand endpoints ----------------
  addBrand: `${ROOTURL}admin/brands/`,
  listBrand: `${ROOTURL}admin/brands/`,
  getBrand: `${ROOTURL}admin/brands/getBrandById/`,
  updateBrand: `${ROOTURL}admin/brands/updateBrand/`,
  softDeleteBrand: `${ROOTURL}admin/brands/softDeleteBrand/`,
  restoreBrand: `${ROOTURL}admin/brands/restore`, 
  hardDeleteBrand: `${ROOTURL}admin/brands/permanentDelete`,
  toggleBrandStatus: `${ROOTURL}admin/brands/togglestatus`,
  trashBrands: `${ROOTURL}admin/brands/trash`,
  checkDuplicateBrand: `${ROOTURL}admin/brands/check-duplicate`,


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
  subCategoryByMainCategoryId: `${ROOTURL}admin/subcategory/activeSubCategory/`,
  listActiveMainCategory: `${ROOTURL}admin/subcategory/activemain-categorylist`,
  
  
  // ---------------- Coupon endpoints ----------------

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

    // -------------------------- Sliders endpoints------------
  addSlider:`${ROOTURL}admin/sliders/`,
  listSLider:`${ROOTURL}admin/sliders/`,
  getSliderById:`${ROOTURL}admin/sliders/getSliderById/`,
  sliderStats:`${ROOTURL}admin/sliders/sliderStats`,
  updateSlider:`${ROOTURL}admin/sliders/`,
  toggleStatusSlider:`${ROOTURL}admin/sliders/`,
  deleteSlider:`${ROOTURL}admin/sliders/`,
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
  addProduct: `${ROOTURL}admin/products/`,
  listProduct: `${ROOTURL}admin/products/`,
  getProductById: `${ROOTURL}admin/products/getProductById/`,
  updateProduct: `${ROOTURL}admin/products/updateProduct/`,
  softDeleteProduct: `${ROOTURL}admin/products/softDelete/`,
  permanentDeleteProduct: `${ROOTURL}admin/products/permanentDelete/`,
  restoreProduct: `${ROOTURL}admin/products/restore/`,
  toggleProductStatus: `${ROOTURL}admin/products/toggleStatus/`,
  trashProducts: `${ROOTURL}admin/products/trash`,
  checkProductSlug: `${ROOTURL}admin/products/checkSlugExist`,
  // Order endpoints
  listOrder: `${ROOTURL}admin/orders/`,
  getOrderById: `${ROOTURL}admin/orders/`,
  updateOrderStatus: `${ROOTURL}admin/orders/orderstatus`,
  updatePaymentStatus: `${ROOTURL}admin/orders/paymentstatus`,
  deleteOrder: `${ROOTURL}admin/orders/`, 

  // Offer Management
  addOffer: `${ROOTURL}admin/offers/`, 
  listOffer: `${ROOTURL}admin/offers/`,
  getOfferById: `${ROOTURL}admin/offers/`,
  updateOffer: `${ROOTURL}admin/offers/`,
  toggleOfferStatus: `${ROOTURL}admin/offers/toggle-status/`,
  // softDeleteOffer: `${ROOTURL}admin/offer/soft/`,
  // restoreOffer: `${ROOTURL}admin/offer/restore/`,
  permanentDeleteOffer: `${ROOTURL}admin/offers/permanent/`,
  checkOfferDuplicate: `${ROOTURL}admin/offers/check-duplicate`, 

   //  BlogCategory endpoints
    addBlogCategory: `${ROOTURL}admin/blog-category/`,
    listBlogCategory: `${ROOTURL}admin/blog-category/`,
    getBlogCategory: `${ROOTURL}admin/blog-category/getBlogCategoryById/`,
    updateBlogCategory: `${ROOTURL}admin/blog-category/updateBlogCategory/`,
    softDeleteBlogCategory: `${ROOTURL}admin/blog-category/softDeleteBlogCategory/`,
    restoreBlogCategory: `${ROOTURL}admin/blog-category/restore/`,
    hardDeleteBlogCategory: `${ROOTURL}admin/blog-category/permanentDelete/`,
    toggleBlogCategoryStatus: `${ROOTURL}admin/blog-category/toggleStatus/`,
    trashBlogCategory: `${ROOTURL}admin/blog-category/trash`,
    checkDuplicateBlogCategory: `${ROOTURL}admin/blog-category/check-duplicate`,

      //  Blog endpoints
   addBlog: `${ROOTURL}admin/blogs/`,
  listBlog: `${ROOTURL}admin/blogs/`,
  getBlog: (id: string) => `${ROOTURL}admin/blogs/get/${id}`,
  updateBlog: (id: string) => `${ROOTURL}admin/blogs/update/${id}`,
  softDeleteBlog: (id: string) => `${ROOTURL}admin/blogs/delete/${id}`,
  trashBlog: `${ROOTURL}admin/blogs/trash`,
  toggleBlogStatus: (id: string) => `${ROOTURL}admin/blogs/status/${id}`,
  restoreBlog: (id: string) => `${ROOTURL}admin/blogs/restore/${id}`,
  permanentDelete: (id: string) => `${ROOTURL}admin/blogs/permanentDelete/${id}`,
  checkDuplicate: `${ROOTURL}admin/blogs/check-duplicate`,
    
  // ---------- Promotions endpoints ----------
  addPromotions: `${ROOTURL}admin/promotions`,
  listPromotions: `${ROOTURL}admin/promotions`,
  getPromotions: `${ROOTURL}admin/promotions/getPromotionsById/`,
  updatePromotions: `${ROOTURL}admin/promotions/updatePromotions/`,
  softDeletePromotions: `${ROOTURL}admin/promotions/softDeletePromotions/`,
  permanantDeletePromotions: `${ROOTURL}admin/promotions/permanentDelete/`,
  restorePromotions: `${ROOTURL}admin/promotions/restore/`,
  toggleStatusPromotions: `${ROOTURL}admin/promotions/togglestatus/`,
  trashPromotions: `${ROOTURL}admin/promotions/trash`,
  promotionsStats: `${ROOTURL}admin/promotions/stats`,
  checkDuplicatePromotions: `${ROOTURL}admin/promotions/check-duplicate`,
};
 

const ImportedURL = { API, LIVEURL, FILEURL, SETTINGS_ID };
export default ImportedURL;
