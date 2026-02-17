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

  // Testimonial endpoints
  addTestimonial: `${ROOTURL}admin/testimonials/`,
  listTestimonial: `${ROOTURL}admin/testimonials/`,
  getTestimonialById: `${ROOTURL}admin/testimonials/getTestimonialById`,
  updateTestimonial: `${ROOTURL}admin/testimonials/updateTestimonial/`,
  deleteTestimonial: `${ROOTURL}admin/testimonials/softDelete/`,
  hardDeleteTestimonial: `${ROOTURL}admin/testimonials/permanentDelete`,
  toggleStatusTestimonial: `${ROOTURL}admin/testimonials/togglestatus`,
}

const ImportedURL = { API, LIVEURL, FILEURL, SETTINGS_ID };
export default ImportedURL;