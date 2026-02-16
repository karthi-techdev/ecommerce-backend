export interface PageFormData {
  name: string;
  slug: string;
  type: "content" | "url";
  description?: string;
  url?: string;
  isActive?: boolean;
}

export interface ValidationErrors {
  name?: string;
  slug?: string;
  type?: string;
  description?: string;
  url?: string;
}


export const validatePageForm = (
  data: PageFormData,
  // isEdit:boolean = false
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.name) {
    errors.name = "Name is required.";
  } else if (!data.name.trim()) {
    errors.name = "Name cannot start with space.";
  } else if (data.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters long.";
  } else if (!/[a-zA-Z]/.test(data.name)) {
    errors.name = "Name must contain at least one letter.";
  }

  

  if (!data.type) {
    errors.type = "Type is required.";
  } else if (!["content", "url"].includes(data.type)) {
    errors.type = "Invalid page type selected.";
  }

 if (data.type === "content") {
  const description = data.description || "";
  const hasImage = /<img[^>]*>/i.test(description);
  const textOnly = description
    .replace(/<[^>]*>/g, "")     
    .replace(/&nbsp;/g, " ")       
    .trim();
  if (!description || (!textOnly && !hasImage)) {
    errors.description = "Description is required.";
  } 
  else if (!hasImage && textOnly.length < 10) {
    errors.description = "Content must be at least 10 characters long.";
  }
}

  if (data.type === "url") {
    if (!data.url) {
      errors.url = "URL is required.";
    } else {
      const urlRegex = /^(https?:\/\/)([\w.-]+)+(:\d+)?(\/([\w/_-]+))*\/?(\?.*)?$/i;

      if (!urlRegex.test(data.url)) {
        errors.url = "Please enter a valid URL (https://example.com).";
      }
    }
  }

  return errors;
};
