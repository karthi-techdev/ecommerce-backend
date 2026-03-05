// import { Router } from "express";
// import OrderController from "../controllers/orderController";

// const orderRoutes = Router();

// orderRoutes.post("/",(req, res, next) =>OrderController.createOrder(req, res, next));
// orderRoutes.get("/",(req, res, next) =>OrderController.getAllOrders(req, res, next));
// orderRoutes.put("/:id",(req, res, next) =>OrderController.updateOrder(req, res, next));
// orderRoutes.delete("/:id",(req, res, next) =>OrderController.softDeleteOrder(req, res, next));
// orderRoutes.delete("/permanent/:id",(req, res, next) =>OrderController.deleteOrderPermanently(req, res, next));
// orderRoutes.patch("/orderstatus/:id",(req, res, next) =>OrderController.updateOrderStatus(req, res, next));
// orderRoutes.patch("/paymentstatus/:id",(req, res, next) =>OrderController.updatePaymentStatus(req, res, next));

// export default orderRoutes;

import { Router } from "express";
import OrderController from "../controllers/orderController";

const orderRoutes = Router();

orderRoutes.get("/", OrderController.getAllOrders);
orderRoutes.get("/:id", OrderController.getOrderById);
// orderRoutes.put("/:id/status", OrderController.updateOrderStatus);
orderRoutes.put("/orderstatus/:id", OrderController.updateOrderStatus);
orderRoutes.delete("/:id", OrderController.cancelOrder);

export default orderRoutes;