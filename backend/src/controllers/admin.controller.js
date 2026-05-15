const {
	getAdminOrders,
	updateOrderStatus,
	getOrderById,
} = require("../services/order.service");

const listOrders = async (req, res, next) => {
	try {
		const result = await getAdminOrders(req.query);
		return res.status(200).json(result);
	} catch (error) {
		return next(error);
	}
};

const updateStatus = async (req, res, next) => {
	try {
		const result = await updateOrderStatus({
			orderId: req.params.id,
			status: req.body.status,
		});
		return res.status(200).json(result);
	} catch (error) {
		return next(error);
	}
};

const getOrder = async (req, res, next) => {
	try {
		const result = await getOrderById({
			orderId: req.params.id,
			userId: req.user.id,
			isAdmin: true,
		});
		return res.status(200).json(result);
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	listOrders,
	updateStatus,
	getOrder,
};
