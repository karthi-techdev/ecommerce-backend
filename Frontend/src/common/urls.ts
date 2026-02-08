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
};

const ImportedURL = { API, LIVEURL, FILEURL, SETTINGS_ID };
export default ImportedURL;
