import fs from "fs";
import path from "path";

export function createTemplateFile(slug: string, content: string) {
  const templateDir = path.join(process.cwd(), "src/templates/newsletters");

  if (!fs.existsSync(templateDir)) {
    fs.mkdirSync(templateDir, { recursive: true });
  }

  const filePath = path.join(templateDir, `${slug}.html`);

  fs.writeFileSync(filePath, content || "");

  console.log(`Template created: ${slug}.html`);
}