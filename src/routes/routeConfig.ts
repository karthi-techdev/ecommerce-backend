import { Express, Router } from "express";
import { authenticate } from "../middleware/authentication";

interface RouteConfig {
  path: string;
  router: Router;
  middleware?: Array<any>;
}

export const routes: RouteConfig[] = [
  { path: "/api/v1/auth", router: require("./authenticationRoutes").default },
  { 
    path: "/api/v1/faqs", 
    router: require("./faqRoutes").default
  },
  { 
    path: "/api/v1/blogcategory", 
    router: require("./blogCategoryRoutes").default
  },
  { 
    path: "/api/v1/category", 
    router: require("./categoryRoutes").default
  },
  { path: "/api/v1/newsletters", router: require("./newLetterRoutes").default },
  { 
    path: "/api/v1/pages", 
    router: require("./pagesRoutes").default
  },
  { 
    path: "/api/v1/footerinfo", 
    router: require("./footerInfoRoutes").default
  },
  { 
    path: "/api/v1/configs", 
    router: require("./configRoutes").default
  },
  { 
    path: "/api/v1/settings", 
    router: require("./settingsRoutes").default
  },
  { 
    path: "/api/v1/banners", 
    router: require("./bannerRoutes").default
  },
  { path: "/api/v1/editer/image", router: require("./uploadEditorImages").default },
  { 
    path: "/api/v1/agencies", 
    router: require("./agencyRoutes").default
  }
];

export function registerRoutes(app: Express) {
  routes.forEach(({ path, router, middleware = [] }) => {
    app.use(path, ...middleware, router);
  });
}