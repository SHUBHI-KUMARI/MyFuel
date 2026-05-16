const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET is not set");
	}
	return secret;
};

const signToken = (payload) => {
	const secret = getJwtSecret();
	const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
	return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token) => {
	const secret = getJwtSecret();
	return jwt.verify(token, secret);
};

module.exports = {
	signToken,
	verifyToken,
};
