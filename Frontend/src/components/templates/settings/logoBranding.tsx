// import React, { useEffect, useState } from 'react';
// import { useSettingsStore } from '../../../stores/settingsStore';
// import FormHeader from '../../molecules/FormHeader';
// import { toast } from 'react-toastify';
// import ImportedURL from '../../../common/urls';
// import { validateLogoBranding, type LogoBrandingErrors } from '../../validations/settingsValidation';

// const LogoBrandingTemplate: React.FC<{ isTabbed?: boolean }> = ({ isTabbed }) => {
//   const { fetchSettings, updateSettings } = useSettingsStore();
  
//   // State for paths saved in the Database
//   const [dbPaths, setDbPaths] = useState({ adminLogo: '', siteLogo: '', favicon: '' });
//   // State for temporary browser previews (Blob URLs)
//   const [localPreviews, setLocalPreviews] = useState<{ [key: string]: string }>({});
//   // State for the actual File objects to be uploaded
//   const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});
//   const [errors, setErrors] = useState<LogoBrandingErrors>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     fetchSettings().then(data => { if (data?.branding) setDbPaths(data.branding); });
//   }, [fetchSettings]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, files } = e.target;
//     if (files && files[0]) {
//       const file = files[0];
//       setSelectedFiles(prev => ({ ...prev, [name]: file }));
//       setLocalPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

//   // HELPER: Extract filename from a path (e.g., "uploads/logo.png" -> "logo.png")
//   const getFileNameFromPath = (path: string) => {
//     if (!path) return "No file chosen";
//     return path.split('/').pop();
//   };

//   const getImageSource = (fieldName: string) => {
//     if (localPreviews[fieldName]) return localPreviews[fieldName];
//     const path = (dbPaths as any)[fieldName];
//     if (path) {
//         const baseUrl = ImportedURL.FILEURL.endsWith('/') ? ImportedURL.FILEURL.slice(0, -1) : ImportedURL.FILEURL;
//         const cleanPath = path.startsWith('/') ? path : `/${path}`;
//         return `${baseUrl}${cleanPath}`;
//     }
//     return null;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const valErrors = validateLogoBranding(selectedFiles, dbPaths);
//     if (Object.keys(valErrors).length > 0) {
//         setErrors(valErrors);
//         return;
//     }

//     setIsSubmitting(true);
//     const formData = new FormData();
//     if (selectedFiles.siteLogo) formData.append('siteLogo', selectedFiles.siteLogo);
//     if (selectedFiles.adminLogo) formData.append('adminLogo', selectedFiles.adminLogo);
//     if (selectedFiles.favicon) formData.append('favicon', selectedFiles.favicon);

//     try {
//       // 1. Send to server
//       const updatedSettings = await updateSettings(formData);
      
//       // 2. IMMEDIATE UPDATE: Update local dbPaths state with the server response
//       if (updatedSettings?.branding) {
//         setDbPaths(updatedSettings.branding);
//       }

//       // 3. CLEANUP: Clear temporary previews and selected file references
//       setLocalPreviews({});
//       setSelectedFiles({});
      
//       toast.success('Branding updated successfully');
//     } catch (err) { 
//         toast.error('Upload failed'); 
//     } finally { 
//         setIsSubmitting(false); 
//     }
//   };

//   return (
//     <div className={isTabbed ? "p-0" : "p-6"}>
//       {!isTabbed && <FormHeader managementName="Logo & Branding" type="Edit" />}
      
//       <div className="bg-white border border-gray-200 rounded-xl p-10 shadow-sm mt-4">
//         <form onSubmit={handleSubmit} className="space-y-12">
//           {['siteLogo', 'adminLogo', 'favicon'].map((name) => (
//             <div key={name} className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-gray-100 last:border-0">
              
//               <div className="flex-1 max-w-md">
//                 <label className="block text-sm font-bold text-gray-700 capitalize mb-4">
//                     {name.replace(/([A-Z])/g, ' $1')}
//                     <span className="text-red-500 ml-1">*</span>
//                 </label>
                
//                 <div className="flex items-center gap-4">
//                     {/* Styled "Choose File" Button */}
//                     <label className="cursor-pointer bg-amber-50 text-amber-600 px-5 py-2 rounded-lg font-bold text-sm border border-amber-200 hover:bg-amber-100 transition-all">
//                         Choose File
//                         <input 
//                             type="file" 
//                             name={name} 
//                             accept="image/*" 
//                             onChange={handleFileChange} 
//                             className="hidden" 
//                         />
//                     </label>

//                     {/* FILENAME DISPLAY LOGIC */}
//                     <span className="text-sm text-gray-500 truncate max-w-[200px]">
//                         {selectedFiles[name] 
//                           ? selectedFiles[name]?.name 
//                           : getFileNameFromPath((dbPaths as any)[name])}
//                     </span>
//                 </div>
                
//                 {errors[name as keyof LogoBrandingErrors] && (
//                     <p className="text-red-500 text-xs mt-2">{errors[name as keyof LogoBrandingErrors]}</p>
//                 )}
//               </div>

//               {/* Preview Box - Updates instantly via LocalPreview or new dbPath */}
//               <div className="w-36 h-36 border border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50 overflow-hidden shadow-sm">
//                 {getImageSource(name) ? (
//                     <img key={getImageSource(name)} src={getImageSource(name)!} className="max-w-full max-h-full object-contain p-3" alt={name} />
//                 ) : (
//                     <span className="text-[10px] text-gray-400 font-bold">No Image</span>
//                 )}
//               </div>

//             </div>
//           ))}

//           <div className="mt-8 flex justify-start">
//             <button 
//                 type="submit" 
//                 disabled={isSubmitting} 
//                 className="px-12 py-3.5 bg-amber-500 text-white font-bold rounded-lg shadow-md hover:bg-amber-600 transition-all active:scale-95 disabled:opacity-50"
//             >
//               {isSubmitting ? 'Uploading...' : 'Save Branding'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LogoBrandingTemplate;

// import React, { useEffect, useState, useCallback } from 'react';
// import { useSettingsStore } from '../../../stores/settingsStore';
// import FormHeader from '../../molecules/FormHeader';
// import { toast } from 'react-toastify';
// import ImportedURL from '../../../common/urls';
// import { validateLogoBranding, type LogoBrandingErrors } from '../../validations/settingsValidation';

// const LogoBrandingTemplate: React.FC<{ isTabbed?: boolean }> = ({ isTabbed }) => {
//   const { fetchSettings, updateSettings } = useSettingsStore();
  
//   const [dbPaths, setDbPaths] = useState({ adminLogo: '', siteLogo: '', favicon: '' });
//   const [localPreviews, setLocalPreviews] = useState<{ [key: string]: string }>({});
//   const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});
//   const [errors, setErrors] = useState<LogoBrandingErrors>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Sync Favicon logic
//   const syncFaviconToBrowser = useCallback((path: string) => {
//     if (!path) return;
//     const baseUrl = ImportedURL.FILEURL.endsWith('/') ? ImportedURL.FILEURL.slice(0, -1) : ImportedURL.FILEURL;
//     const cleanPath = path.startsWith('/') ? path : `/${path}`;
//     const fullUrl = `${baseUrl}${cleanPath}?t=${new Date().getTime()}`;

//     const existingLinks = document.querySelectorAll("link[rel~='icon']");
//     existingLinks.forEach(link => link.parentNode?.removeChild(link));

//     const newLink = document.createElement('link');
//     newLink.id = 'dynamic-favicon';
//     newLink.rel = 'icon';
//     newLink.href = fullUrl;
//     document.getElementsByTagName('head')[0].appendChild(newLink);
//   }, []);

//   useEffect(() => {
//     fetchSettings().then(data => { 
//       if (data?.branding) {
//         setDbPaths(data.branding);
//         if (data.branding.favicon) syncFaviconToBrowser(data.branding.favicon);
//       }
//     });
//   }, [fetchSettings, syncFaviconToBrowser]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, files } = e.target;
//     if (files && files[0]) {
//       const file = files[0];
//       setSelectedFiles(prev => ({ ...prev, [name]: file }));
//       setLocalPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const getImageSource = (fieldName: string) => {
//     if (localPreviews[fieldName]) return localPreviews[fieldName];
//     const path = (dbPaths as any)[fieldName];
//     if (path) {
//         const baseUrl = ImportedURL.FILEURL.endsWith('/') ? ImportedURL.FILEURL.slice(0, -1) : ImportedURL.FILEURL;
//         const cleanPath = path.startsWith('/') ? path : `/${path}`;
//         return `${baseUrl}${cleanPath}`;
//     }
//     return null;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const valErrors = validateLogoBranding(selectedFiles, dbPaths);
//     if (Object.keys(valErrors).length > 0) {
//         setErrors(valErrors);
//         return;
//     }

//     setIsSubmitting(true);
//     const formData = new FormData();
//     if (selectedFiles.siteLogo) formData.append('siteLogo', selectedFiles.siteLogo);
//     if (selectedFiles.adminLogo) formData.append('adminLogo', selectedFiles.adminLogo);
//     if (selectedFiles.favicon) formData.append('favicon', selectedFiles.favicon);

//     try {
//       // updateSettings should be set up in your store to update the global 'settings' object
//       const updatedSettings = await updateSettings(formData);
      
//       if (updatedSettings?.branding) {
//         setDbPaths(updatedSettings.branding);
//         syncFaviconToBrowser(updatedSettings.branding.favicon);
//       }

//       setLocalPreviews({});
//       setSelectedFiles({});
//       toast.success('Branding updated successfully');
//     } catch (err) { 
//         toast.error('Upload failed'); 
//     } finally { 
//         setIsSubmitting(false); 
//     }
//   };

//   return (
//     <div className={isTabbed ? "p-0" : "p-6"}>
//       {!isTabbed && <FormHeader managementName="Logo & Branding" type="Edit" />}
//       <div className="bg-white border border-gray-200 rounded-xl p-10 shadow-sm mt-4">
//         <form onSubmit={handleSubmit} className="space-y-12">
//           {['siteLogo', 'adminLogo', 'favicon'].map((name) => (
//             <div key={name} className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-gray-100 last:border-0">
//               <div className="flex-1 max-w-md">
//                 <label className="block text-sm font-bold text-gray-700 capitalize mb-4">
//                     {name.replace(/([A-Z])/g, ' $1')}
//                     <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <div className="flex items-center gap-4">
//                     <label className="cursor-pointer bg-amber-50 text-amber-600 px-5 py-2 rounded-lg font-bold text-sm border border-amber-200 hover:bg-amber-100 transition-all">
//                         Choose File
//                         <input type="file" name={name} accept="image/*" onChange={handleFileChange} className="hidden" />
//                     </label>
//                     <span className="text-sm text-gray-500 truncate max-w-[200px]">
//                         {selectedFiles[name] ? selectedFiles[name]?.name : (dbPaths as any)[name]?.split('/').pop() || "No file chosen"}
//                     </span>
//                 </div>
//                 {errors[name as keyof LogoBrandingErrors] && <p className="text-red-500 text-xs mt-2">{errors[name as keyof LogoBrandingErrors]}</p>}
//               </div>
//               <div className="w-36 h-36 border border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50 overflow-hidden shadow-sm">
//                 {getImageSource(name) ? (
//                     <img key={getImageSource(name)} src={getImageSource(name)!} className="max-w-full max-h-full object-contain p-3" alt={name} />
//                 ) : (
//                     <span className="text-[10px] text-gray-400 font-bold">No Image</span>
//                 )}
//               </div>
//             </div>
//           ))}
//           <div className="mt-8 flex justify-start">
//             <button type="submit" disabled={isSubmitting} className="px-12 py-3.5 bg-amber-500 text-white font-bold rounded-lg shadow-md hover:bg-amber-600 transition-all active:scale-95 disabled:opacity-50">
//               {isSubmitting ? 'Uploading...' : 'Save Branding'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LogoBrandingTemplate;

import React, { useEffect, useState, useCallback } from 'react';
import { useSettingsStore } from '../../../stores/settingsStore';
import FormHeader from '../../molecules/FormHeader';
import { toast } from 'react-toastify';
import ImportedURL from '../../../common/urls';
import { validateLogoBranding, type LogoBrandingErrors } from '../../validations/settingsValidation';

const LogoBrandingTemplate: React.FC<{ isTabbed?: boolean }> = ({ isTabbed }) => {
  // fetchSettings and updateSettings come from your Zustand store
  const { fetchSettings, updateSettings } = useSettingsStore();
  
  const [dbPaths, setDbPaths] = useState({ adminLogo: '', siteLogo: '', favicon: '' });
  const [localPreviews, setLocalPreviews] = useState<{ [key: string]: string }>({});
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});
  const [errors, setErrors] = useState<LogoBrandingErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * CORE LOGIC: Updates the browser tab icon and saves to localStorage
   */
  const syncFaviconToBrowser = useCallback((path: string) => {
    if (!path) return;

    const baseUrl = ImportedURL.FILEURL.endsWith('/') 
      ? ImportedURL.FILEURL.slice(0, -1) 
      : ImportedURL.FILEURL;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    // Timestamp (?t=) prevents the browser from showing the old cached image
    const fullUrl = `${baseUrl}${cleanPath}?t=${new Date().getTime()}`;

    // 1. Update the DOM element in <head>
    let link = document.getElementById('dynamic-favicon') as HTMLLinkElement;
    
    if (!link) {
        // If the link doesn't exist for some reason, create it
        link = document.createElement('link');
        link.id = 'dynamic-favicon';
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    
    link.href = fullUrl;

    // 2. Save to localStorage so index.html can see it on next page load/refresh
    localStorage.setItem('cached_favicon', fullUrl);
  }, []);

  // Initial Load: Fetch data and sync the favicon
  useEffect(() => {
    fetchSettings().then(data => { 
      if (data?.branding) {
        setDbPaths(data.branding);
        if (data.branding.favicon) {
            syncFaviconToBrowser(data.branding.favicon);
        }
      }
    });
  }, [fetchSettings, syncFaviconToBrowser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setSelectedFiles(prev => ({ ...prev, [name]: file }));
      // Create local URL for instant preview in the boxes below
      setLocalPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const getFileNameFromPath = (path: string) => {
    if (!path) return "No file chosen";
    return path.split('/').pop();
  };

  const getImageSource = (fieldName: string) => {
    // Show local preview if user just selected a file, otherwise show DB image
    if (localPreviews[fieldName]) return localPreviews[fieldName];
    const path = (dbPaths as any)[fieldName];
    if (path) {
        const baseUrl = ImportedURL.FILEURL.endsWith('/') ? ImportedURL.FILEURL.slice(0, -1) : ImportedURL.FILEURL;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${baseUrl}${cleanPath}`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const valErrors = validateLogoBranding(selectedFiles, dbPaths);
    if (Object.keys(valErrors).length > 0) {
        setErrors(valErrors);
        return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    if (selectedFiles.siteLogo) formData.append('siteLogo', selectedFiles.siteLogo);
    if (selectedFiles.adminLogo) formData.append('adminLogo', selectedFiles.adminLogo);
    if (selectedFiles.favicon) formData.append('favicon', selectedFiles.favicon);

    try {
      // updateSettings should update the state in useSettingsStore
      // which will instantly update the Navbar
      const updatedSettings = await updateSettings(formData);
      
      if (updatedSettings?.branding) {
        setDbPaths(updatedSettings.branding);
        // Instantly update the browser tab icon
        syncFaviconToBrowser(updatedSettings.branding.favicon);
      }

      setLocalPreviews({});
      setSelectedFiles({});
      toast.success('Branding updated successfully');
    } catch (err) { 
        toast.error('Upload failed'); 
    } finally { 
        setIsSubmitting(false); 
    }
  };

  return (
    <div className={isTabbed ? "p-0" : "p-6"}>
      {!isTabbed && <FormHeader managementName="Logo & Branding" type="Edit" />}
      
      <div className="bg-white border border-gray-200 rounded-xl p-10 shadow-sm mt-4">
        <form onSubmit={handleSubmit} className="space-y-12">
          {['siteLogo', 'adminLogo', 'favicon'].map((name) => (
            <div key={name} className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-gray-100 last:border-0">
              
              <div className="flex-1 max-w-md">
                <label className="block text-sm font-bold text-gray-700 capitalize mb-4">
                    {name.replace(/([A-Z])/g, ' $1')}
                    <span className="text-red-500 ml-1">*</span>
                </label>
                
                <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-amber-50 text-amber-600 px-5 py-2 rounded-lg font-bold text-sm border border-amber-200 hover:bg-amber-100 transition-all">
                        Choose File
                        <input type="file" name={name} accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>

                    <span className="text-sm text-gray-500 truncate max-w-[200px]">
                        {selectedFiles[name] ? selectedFiles[name]?.name : getFileNameFromPath((dbPaths as any)[name])}
                    </span>
                </div>
                {errors[name as keyof LogoBrandingErrors] && (
                    <p className="text-red-500 text-xs mt-2">{errors[name as keyof LogoBrandingErrors]}</p>
                )}
              </div>

              {/* Box Preview */}
              <div className="w-36 h-36 border border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50 overflow-hidden shadow-sm">
                {getImageSource(name) ? (
                    <img key={getImageSource(name)} src={getImageSource(name)!} className="max-w-full max-h-full object-contain p-3" alt={name} />
                ) : (
                    <span className="text-[10px] text-gray-400 font-bold">No Image</span>
                )}
              </div>

            </div>
          ))}

          <div className="mt-8 flex justify-start">
            <button 
                type="submit" 
                disabled={isSubmitting} 
                className="px-12 py-3.5 bg-amber-500 text-white font-bold rounded-lg shadow-md hover:bg-amber-600 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Uploading...' : 'Save Branding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogoBrandingTemplate;