const ORDER_STATUS = ["pending", "accepted", "out-for-delivery", "delivered"];

const DEFAULT_STATUS = ORDER_STATUS[0];

const normalizeOrderStatus = (value) => {
	if (value === undefined || value === null) {
		return value;
	}

	return String(value).trim().toLowerCase().replace(/\s+/g, "-");
};

module.exports = {
	ORDER_STATUS,
	DEFAULT_STATUS,
	normalizeOrderStatus,
};
