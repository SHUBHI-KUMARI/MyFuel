const {
	createOrder,
	getUserOrders,
	getOrderById,
} = require("../services/order.service");

const createFuelOrder = async (req, res, next) => {
	try {
		const result = await createOrder({
			userId: req.user.id,
			...req.body,
		});
		return res.status(201).json(result);
	} catch (error) {
		return next(error);
	}
};

const listMyOrders = async (req, res, next) => {
	try {
		const result = await getUserOrders(req.user.id);
		return res.status(200).json(result);
	} catch (error) {
		return next(error);
	}
};

const getMyOrder = async (req, res, next) => {
	try {
		const result = await getOrderById({
			orderId: req.params.id,
			userId: req.user.id,
			isAdmin: false,
		});
		return res.status(200).json(result);
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	createFuelOrder,
	listMyOrders,
	getMyOrder,
};
