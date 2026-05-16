const { verifyToken } = require("../utils/jwt");

const requireAuth = (req, res, next) => {
	const header = req.headers.authorization || "";
	const [type, token] = header.split(" ");

	if (type !== "Bearer" || !token) {
		return res.status(401).json({ message: "Missing auth token" });
	}

	try {
		const payload = verifyToken(token);
		req.user = { id: payload.id, role: payload.role };
		return next();
	} catch (error) {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
};

const requireRole = (role) => (req, res, next) => {
	if (!req.user || req.user.role !== role) {
		return res.status(403).json({ message: "Forbidden" });
	}
	return next();
};

module.exports = {
	requireAuth,
	requireRole,
};
