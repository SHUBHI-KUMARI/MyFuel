const validateBody = (schema) => (req, res, next) => {
	const result = schema.safeParse(req.body);
	if (!result.success) {
		return res.status(400).json({
			message: "Validation failed",
			errors: result.error.flatten(),
		});
	}
	req.body = result.data;
	return next();
};

const validateQuery = (schema) => (req, res, next) => {
	const result = schema.safeParse(req.query);
	if (!result.success) {
		return res.status(400).json({
			message: "Validation failed",
			errors: result.error.flatten(),
		});
	}
	req.query = result.data;
	return next();
};

const validateParams = (schema) => (req, res, next) => {
	const result = schema.safeParse(req.params);
	if (!result.success) {
		return res.status(400).json({
			message: "Validation failed",
			errors: result.error.flatten(),
		});
	}
	req.params = result.data;
	return next();
};

module.exports = {
	validateBody,
	validateQuery,
	validateParams,
};
