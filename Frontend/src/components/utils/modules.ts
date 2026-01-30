// modules.ts
let modulesFromEnv = import.meta.env.VITE_MODULES;
let modulesArr: string[] = [];
if (typeof modulesFromEnv === 'string' && modulesFromEnv.trim() !== '') {
  modulesArr = modulesFromEnv.split(',').map(m => m.trim()).filter(Boolean);
}
if (modulesArr.length === 0) {
  modulesArr = ['faq'];
}
const MODULES = modulesArr;

export { MODULES };