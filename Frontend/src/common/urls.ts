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

};

const ImportedURL = { API, LIVEURL, FILEURL, SETTINGS_ID };
export default ImportedURL;