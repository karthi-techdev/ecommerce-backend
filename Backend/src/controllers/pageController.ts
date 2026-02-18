import { NextFunction, Request , Response } from "express";
import PageService from "../services/pageService";
import { HTTP_RESPONSE , HTTP_STATUS_CODE } from "../utils/httpResponse";

class PageController {

    async createPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, slug } = req.body;

      if (!name) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Name is required ",
        });
        return;
      }

      if (!slug) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Slug is required ",
        });
        return;
      }

      const isDuplicate = await PageService.existBySlug(slug);
        if (isDuplicate) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
            status: HTTP_RESPONSE.FAIL,
            message: "Slug already exists. Please choose a unique one.",
        });
        return;
        }

      const page = await PageService.createPages(req.body);
      res.status(HTTP_STATUS_CODE.OK).json({ status: HTTP_RESPONSE.SUCCESS, data: page });
    } catch (error: any) {
        if (error.code === 11000) {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_RESPONSE.FAIL,
        message: "This slug is already exist.",
      });
      return;
    }
      res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ 
        status: HTTP_RESPONSE.FAIL, 
        data: error.message 
      });
    }
  }

  async updatePage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ status: HTTP_RESPONSE.FAIL, message: "Page id is required" });
        return;
      }

      const updatedPage = await PageService.updatePages(id, req.body);
      if (!updatedPage) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ status: HTTP_RESPONSE.FAIL, message: "Page not found" });
        return;
      }
      res.status(HTTP_STATUS_CODE.OK).json({ status: HTTP_RESPONSE.SUCCESS, data: updatedPage });
    } catch (error: any) {
      next(error);
    }
  }

    async getAllPages(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const filter = req.query.status as string | undefined;
            const Pages = await PageService.getAllPages(page , limit , filter);
            res.status(HTTP_STATUS_CODE.OK).json({ status : HTTP_RESPONSE.SUCCESS , 
                data : Pages.data,
                meta: {
                    total: Pages.meta.total,
                    active: Pages.meta.active,
                    inactive: Pages.meta.inactive,
                    totalPages: Pages.meta.totalPages,
                    page: Pages.meta.page,
                    limit: Pages.meta.limit
                }
            })
        } catch ( error : any ) {
            next(error);
        }
    }

    async getPagesById(req: Request, res: Response, next: NextFunction) : Promise<void>{
        try {
            const id = req.params.id
            if(!id){
                res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ status: HTTP_RESPONSE.FAIL, message: "Page id is required" });
                return;
            }
            const Page = await PageService.getPagesById(id);
            if (!Page) {
            res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ status: HTTP_RESPONSE.FAIL, message: "Page not found" });
            return;
            }
            res.status(HTTP_STATUS_CODE.OK).json({ status: HTTP_RESPONSE.SUCCESS, data: Page });
        } catch ( error : any ) {
            next(error);
        }
    }

    // async updatePage(req: Request, res: Response, next: NextFunction)  : Promise<void>{
    //     try {
    //         const id = req.params.id
    //         if(!id){
    //             res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ status: HTTP_RESPONSE.FAIL, message: "Page id is required" });
    //             return;
    //         }
    //         const updatedData : any = {
    //             name: req.body.name,
    //             slug: req.body.slug,
    //             description: req.body.description,
    //         }
    //         const Page = await PageService.updatePages(id , updatedData);
    //         if (!Page) {
    //             res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ status: HTTP_RESPONSE.FAIL, message: "Page not found" });
    //             return;
    //         }
    //         res.status(HTTP_STATUS_CODE.OK).json({ status: HTTP_RESPONSE.SUCCESS, data: Page });
    //     } catch (error) {
    //         next(error)
    //     }
    // }

    async softDeletePages( req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            if(!id){
                res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ status: HTTP_RESPONSE.FAIL, message: "Page id is required" });
                return;
            }
            const Page = await PageService.softDeletePages(id);
            if (!Page) {
                res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ status: HTTP_RESPONSE.FAIL, message: "Page not found" });
                return;
            }
            res.status(HTTP_STATUS_CODE.OK).json({ status: HTTP_RESPONSE.SUCCESS, message: "Page deleted successfully", data: Page });
        } catch (error) {
            next(error);
        }
    }

    async togglePageStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            if(!id){
                res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ status: HTTP_RESPONSE.FAIL, message: "Page id is required" });
                return;
            }
            const updated = await PageService.toggleActive(id);
            if (!updated) {
                res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ status: HTTP_RESPONSE.FAIL, message: "Page not found" });
                return;
            }
            res.status(HTTP_STATUS_CODE.OK).json({ status: HTTP_RESPONSE.SUCCESS, message: "Pages status toggled", data: updated });
        } catch (error) {
            next(error)
        }
    }

    async getAllTrashPages(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const filter = req.query.status as string | undefined;
            const Pages = await PageService.getAllTrashPages(page , limit , filter);
            res.status(HTTP_STATUS_CODE.OK).json({ status : HTTP_RESPONSE.SUCCESS , 
                data : Pages.data,
                meta: {
                    total: Pages.meta.total,
                    totalPages: Pages.meta.totalPages,
                    page ,
                    limit
                }
            })
        } catch (error) {
            next(error);
        }
    }

    async restorePages(req: Request,res: Response,next: NextFunction): Promise<void>{
        try {
            const id = req.params.id
            if(!id){
                res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ status: HTTP_RESPONSE.FAIL, message: "Page id is required" });
                return;
            }
            const Page = await PageService.restorePages(id)
            if (!Page) {
                res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ status: HTTP_RESPONSE.FAIL, message: "Page not found" });
                return;
            }
            res.status(HTTP_STATUS_CODE.OK).json({ status: HTTP_RESPONSE.SUCCESS, message: "Page Restored successfully", data: Page });
        } catch (error) {
            next(error);
        }
    }

    async deletePagePermanently(req: Request,res: Response,next: NextFunction): Promise<void>{
        try {
            const id = req.params.id
            if(!id){
                res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ status: HTTP_RESPONSE.FAIL, message: "Page id is required" });
                return;
            }
            const Page = await PageService.deletePagesPermanently(id)
            if (!Page) {
                res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ status: HTTP_RESPONSE.FAIL, message: "Page not found" });
                return;
            }
            res.status(HTTP_STATUS_CODE.OK).json({ status: HTTP_RESPONSE.SUCCESS, message: "Page Deleted Permanently", data: Page });
        } catch (error) {
            next(error)
        }
    }

    async checkDuplicate(req: Request,res: Response,next: NextFunction): Promise<void>{
        try {
            const { slug , excludeId } = req.body;
            if (!slug) {
            res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status: HTTP_RESPONSE.FAIL , message: 'Slug is required' });
            return;
            }
            const exists = await PageService.existBySlug(slug , excludeId);
            if(exists){
                throw new Error(`Name already exists`);
            }
            res.status(HTTP_STATUS_CODE.OK).json({ status: HTTP_RESPONSE.SUCCESS, data : exists });
        } catch (error) {
            res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ status: HTTP_RESPONSE.FAIL , message : "error" });
        }
    }
}

export default new PageController();