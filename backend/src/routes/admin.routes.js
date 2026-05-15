const express = require("express");
const { z } = require("zod");
const { ORDER_STATUS } = require("../constants/orderStatus");
const {
	listOrders,
	updateStatus,
	getOrder,
} = require("../controllers/admin.controller");
const {
	validateBody,
	validateParams,
	validateQuery,
} = require("../middlewares/validate.middleware");
const { requireAuth, requireRole } = require("../middlewares/auth.middleware");

const router = express.Router();

const updateStatusSchema = z.object({
	status: z.enum(ORDER_STATUS),
});

const orderIdSchema = z.object({
	id: z.string().min(24).max(24),
});

const toOptionalNumber = (value) => {
	if (value === undefined || value === null || value === "") {
		return undefined;
	}
	return Number(value);
};

const listOrdersQuerySchema = z.object({
	status: z.enum(ORDER_STATUS).optional(),
	search: z.string().min(1).max(100).optional(),
	from: z.string().datetime().optional(),
	to: z.string().datetime().optional(),
	page: z.preprocess(toOptionalNumber, z.number().int().positive().optional()),
	limit: z.preprocess(toOptionalNumber, z.number().int().positive().optional()),
});

router.use(requireAuth, requireRole("admin"));

router.get("/orders", validateQuery(listOrdersQuerySchema), listOrders);
router.get("/orders/:id", validateParams(orderIdSchema), getOrder);
router.patch(
	"/orders/:id/status",
	validateParams(orderIdSchema),
	validateBody(updateStatusSchema),
	updateStatus
);

module.exports = router;
