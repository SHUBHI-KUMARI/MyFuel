const dotenv = require("dotenv");

dotenv.config();

const env = {
	port: process.env.PORT || 4000,
	mongoUri: process.env.MONGODB_URI || "",
	jwtSecret: process.env.JWT_SECRET || "",
	jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
	corsOrigin: process.env.CORS_ORIGIN || "*",
	nodeEnv: process.env.NODE_ENV || "development",
};

module.exports = env;
