const LIVE = false;

const SITEURL = 'https://example.com/';
const LIVEURL = LIVE ? SITEURL : 'http://localhost:5000/';
const ROOTURL = `${LIVEURL}api/v1/`;
const FILEURL = LIVEURL;
const SETTINGS_ID = '68ad8844bfdf0cec7f623bc2';

const API = {
  // ---------------- FAQ endpoints ----------------
  addFaq: `${ROOTURL}faqs/`,
  listFaq: `${ROOTURL}faqs/`,
  getFaq: `${ROOTURL}faqs/getFaqById/`,
  updateFaq: `${ROOTURL}faqs/updateFaq/`,
  deleteFaq: `${ROOTURL}faqs/softDeleteFaq/`,
  toggleStatusFaq: `${ROOTURL}faqs/togglestatus/`,
  checkDuplicateFaq: `${ROOTURL}faqs/check-duplicate`,
  // Category endpoints
  addCategory: `${ROOTURL}admin/categories/`,
  listCategory: `${ROOTURL}admin/categories/`,
  getCategory: `${ROOTURL}admin/categories/getCategoryById/`,
  updateCategory: `${ROOTURL}admin/categories/updateCategory/`,
  deleteCategory: `${ROOTURL}admin/categories/softDelete/`,
  toggleStatusCategory:`${ROOTURL}admin/categories/togglestatus/`,
  trashCategory:`${ROOTURL}admin/categories/trash`,
  permanentDeleteCategory:`${ROOTURL}admin/categories/permanentDelete/`,
  restoreCategory:`${ROOTURL}admin/categories/restore/`,
  categoryStats:`${ROOTURL}admin/categories/categoryStats`,
  mainCategory:`${ROOTURL}admin/categories/mainCategory`,
  subCategory:`${ROOTURL}admin/categories/subCategory/`,
  slugExist:`${ROOTURL}admin/categories/slugExist`,

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
  addSubCategory: `${ROOTURL}subcategory/`,
  listSubCategory: `${ROOTURL}subcategory/`,
  getSubCategoryById: `${ROOTURL}subcategory/getSubCategoryById/`,
  updateSubCategory: `${ROOTURL}subcategory/updateSubCategory/`,
  deleteSubCategory: `${ROOTURL}subcategory/softDeleteSubCategory/`,
  hardDeleteSubCategory:`${ROOTURL}subcategory/permanentDelete/`,
  restoreSubCategory:`${ROOTURL}subcategory/restore/`,
  toggleStatusSubCategory: `${ROOTURL}subcategory/togglestatus/`,
  checkDuplicateSubCategory: `${ROOTURL}subcategory/check-duplicate`,
  listSubCategoryTrash: `${ROOTURL}subcategory/trash/`,


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
