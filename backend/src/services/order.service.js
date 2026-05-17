const mongoose = require("mongoose");
const Order = require("../models/order.model");
const { ORDER_STATUS, normalizeOrderStatus } = require("../constants/orderStatus");

const ensureValidObjectId = (id, message) => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		const error = new Error(message || "Invalid id");
		error.status = 400;
		throw error;
	}
};

const createOrder = async ({ userId, fuelType, quantity, deliveryLocation, preferredDeliveryTime }) => {
	const order = await Order.create({
		userId,
		fuelType,
		quantity,
		deliveryLocation,
		preferredDeliveryTime: preferredDeliveryTime ? new Date(preferredDeliveryTime) : undefined,
	});

	return { order };
};

const getUserOrders = async (userId) => {
	const orders = await Order.find({ userId }).sort({ createdAt: -1 });
	return { orders };
};

const getOrderById = async ({ orderId, userId, isAdmin }) => {
	ensureValidObjectId(orderId, "Invalid order id");

	const query = isAdmin ? { _id: orderId } : { _id: orderId, userId };
	const orderQuery = Order.findOne(query);
	if (isAdmin) {
		orderQuery.populate("userId", "name email role");
	}
	const order = await orderQuery;

	if (!order) {
		const error = new Error("Order not found");
		error.status = 404;
		throw error;
	}

	return { order };
};

const getAdminOrders = async ({ status, search, from, to, page = 1, limit = 20 }) => {
	const filters = {};

	if (status) {
		const normalizedStatus = normalizeOrderStatus(status);
		if (!ORDER_STATUS.includes(normalizedStatus)) {
			const error = new Error("Invalid status filter");
			error.status = 400;
			throw error;
		}
		filters.status = normalizedStatus;
	}

	if (from || to) {
		filters.createdAt = {};
		if (from) {
			const fromDate = new Date(from);
			if (Number.isNaN(fromDate.getTime())) {
				const error = new Error("Invalid from date");
				error.status = 400;
				throw error;
			}
			filters.createdAt.$gte = fromDate;
		}
		if (to) {
			const toDate = new Date(to);
			if (Number.isNaN(toDate.getTime())) {
				const error = new Error("Invalid to date");
				error.status = 400;
				throw error;
			}
			filters.createdAt.$lte = toDate;
		}
	}

	if (search) {
		const regex = new RegExp(search, "i");
		filters.$or = [{ fuelType: regex }, { deliveryLocation: regex }];
	}

	const safePage = Math.max(Number(page) || 1, 1);
	const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
	const skip = (safePage - 1) * safeLimit;

	const [orders, total] = await Promise.all([
		Order.find(filters)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(safeLimit)
			.populate("userId", "name email role"),
		Order.countDocuments(filters),
	]);

	return {
		orders,
		meta: {
			page: safePage,
			limit: safeLimit,
			total,
			totalPages: Math.ceil(total / safeLimit) || 1,
		},
	};
};

const updateOrderStatus = async ({ orderId, status }) => {
	ensureValidObjectId(orderId, "Invalid order id");
	const normalizedStatus = normalizeOrderStatus(status);

	if (!ORDER_STATUS.includes(normalizedStatus)) {
		const error = new Error("Invalid status");
		error.status = 400;
		throw error;
	}

	const order = await Order.findByIdAndUpdate(
		orderId,
		{ status: normalizedStatus },
		{ new: true }
	);

	if (!order) {
		const error = new Error("Order not found");
		error.status = 404;
		throw error;
	}

	return { order };
};

module.exports = {
	createOrder,
	getUserOrders,
	getOrderById,
	getAdminOrders,
	updateOrderStatus,
};
