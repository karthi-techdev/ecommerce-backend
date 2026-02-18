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
  hardDeleteSubCategory:`${ROOTURL}admin/subcategory/permanentDelete/`,
  restoreSubCategory:`${ROOTURL}admin/subcategory/restore/`,
  toggleStatusSubCategory: `${ROOTURL}admin/subcategory/togglestatus/`,
  checkDuplicateSubCategory: `${ROOTURL}admin/subcategory/check-duplicate`,
  listSubCategoryTrash: `${ROOTURL}admin/subcategory/trash/`,
  listActiveMainCategory: `${ROOTURL}admin/subcategory/activemain-categorylist`,
  //shipmentMethods endpoints
  addShipmentMethods: `${ROOTURL}admin/shipment-methods/`,
  listShipmentMethods: `${ROOTURL}admin/shipment-methods/`,
  getShipmentMethodsById: `${ROOTURL}admin/shipment-methods/getShipmentMethodById/`,
  updateShipmentMethods: `${ROOTURL}admin/shipment-methods/updateSubCategory/updateShipmentMethod`,
  deleteShipmentMethods: `${ROOTURL}admin/shipment-methods/softDeleteShipmentMethod/`,
  toggleStatusShipmentMethods: `${ROOTURL}admin/shipment-methods/togglestatus/`,
  checkDuplicateShipmentMethods: `${ROOTURL}admin/shipment-methods/check-duplicate`,

  // Page endpoints
  addPage: `${ROOTURL}admin/page/`,
  listPage: `${ROOTURL}admin/page/`,
  getPageById: `${ROOTURL}admin/page/`,
  updatePage: `${ROOTURL}admin/page/`,
  deletePage: `${ROOTURL}admin/page/`, 
  hardDeletePage:`${ROOTURL}admin/page/permanent/`,
  restorePage:`${ROOTURL}admin/page/restore/`,
  toggleStatusPage: `${ROOTURL}admin/page/togglestatus/`,
  checkDuplicatePage: `${ROOTURL}admin/page/check-duplicate`,
  listPageTrash: `${ROOTURL}admin/page/trash/`,

};


const ImportedURL = { API, LIVEURL, FILEURL, SETTINGS_ID };
export default ImportedURL;
