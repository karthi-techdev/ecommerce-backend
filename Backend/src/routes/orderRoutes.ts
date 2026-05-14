

import { Router } from "express";
import OrderController from "../controllers/orderController";

const orderRoutes = Router();
orderRoutes.post("/", OrderController.createOrder);
orderRoutes.get("/", OrderController.getAllOrders);
orderRoutes.put("/:id/note", OrderController.updateOrderNote);
orderRoutes.get("/:id", OrderController.getOrderById);
// orderRoutes.put("/:id/status", OrderController.updateOrderStatus);
orderRoutes.put("/orderstatus/:id", OrderController.updateOrderStatus);
orderRoutes.delete("/:id", OrderController.cancelOrder);

export default orderRoutes;