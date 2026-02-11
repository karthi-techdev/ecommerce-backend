const LIVE = false;

const SITEURL = 'https://example.com/';
const LIVEURL = LIVE ? SITEURL : 'http://localhost:5000/';
const ROOTURL = `${LIVEURL}api/v1/`;
const FILEURL = LIVEURL;
const SETTINGS_ID = '68ad8844bfdf0cec7f623bc2';




const API = {
  // FAQ endpoints
  addfaq: `${ROOTURL}faqs/`,
  listfaq: `${ROOTURL}faqs/`,
  getFaq: `${ROOTURL}faqs/getFaqById/`,
  updatefaq: `${ROOTURL}faqs/updateFaq/`,
  deletefaq: `${ROOTURL}faqs/softDeleteFaq/`,
  toggleStatusfaq: `${ROOTURL}faqs/togglestatus/`,
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
};

const ImportedURL = { API, LIVEURL, FILEURL, SETTINGS_ID };
export default ImportedURL;