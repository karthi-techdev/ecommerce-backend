import fs from "fs";
import path from "path";

const TEMPLATE_FOLDER: string = path.join(__dirname, "..", "templates");

function ensureTemplateFolderExists(): void {
  if (!fs.existsSync(TEMPLATE_FOLDER)) {
    fs.mkdirSync(TEMPLATE_FOLDER, { recursive: true });
  }
}

export function writeTemplateFile(slug: string, content: string): string {
  ensureTemplateFolderExists();
  const filePath: string = path.join(TEMPLATE_FOLDER, `${slug}.html`);
  fs.writeFileSync(filePath, content, "utf8");
  return filePath; // return path
}

export function updateTemplateFile(slug: string, content: string): string {
  const filePath: string = path.join(TEMPLATE_FOLDER, `${slug}.html`);
  if (fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, "utf8");
    return filePath;
  } else {
    throw new Error("Template file not found for update.");
  }
}
