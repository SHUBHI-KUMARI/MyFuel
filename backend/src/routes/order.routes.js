const express = require("express");
const { z } = require("zod");
const {
	createFuelOrder,
	listMyOrders,
	getMyOrder,
} = require("../controllers/order.controller");
const { validateBody, validateParams } = require("../middlewares/validate.middleware");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

const createOrderSchema = z.object({
	fuelType: z.string().min(2).max(100),
	quantity: z.number().min(1),
	deliveryLocation: z.string().min(3).max(255),
	preferredDeliveryTime: z.string().datetime().optional(),
});

const orderIdSchema = z.object({
	id: z.string().min(24).max(24),
});

router.use(requireAuth);

router.post("/", validateBody(createOrderSchema), createFuelOrder);
router.get("/", listMyOrders);
router.get("/:id", validateParams(orderIdSchema), getMyOrder);

module.exports = router;
