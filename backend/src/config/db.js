const mongoose = require("mongoose");

const connectDb = async (mongoUri) => {
	if (!mongoUri) {
		throw new Error("MONGODB_URI is not set");
	}

	mongoose.set("strictQuery", true);
	await mongoose.connect(mongoUri);
	return mongoose.connection;
};

module.exports = {
	connectDb,
};
