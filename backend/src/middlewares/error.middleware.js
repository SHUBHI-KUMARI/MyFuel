const notFound = (req, res, next) => {
	res.status(404).json({
		message: "Route not found",
	});
};

const errorHandler = (err, req, res, next) => {
	const status = err.statusCode || err.status || 500;
	const isProd = process.env.NODE_ENV === "production";

	const response = {
		message: err.message || "Internal server error",
	};

	if (!isProd) {
		response.stack = err.stack;
	}

	if (err.name === "ValidationError") {
		response.message = "Validation error";
		response.errors = Object.values(err.errors || {}).map((detail) => detail.message);
	}

	if (err.code === 11000) {
		response.message = "Duplicate key error";
		response.errors = Object.keys(err.keyValue || {});
	}

	if (err.name === "CastError") {
		response.message = "Invalid id format";
	}

	res.status(status).json(response);
};

module.exports = {
	notFound,
	errorHandler,
};
