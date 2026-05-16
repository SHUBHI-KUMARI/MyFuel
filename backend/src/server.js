const app = require("./app");
const env = require("./config/env");
const { connectDb } = require("./config/db");

const startServer = async () => {
	await connectDb(env.mongoUri);
	app.listen(env.port, () => {
		console.log(`Server running on port ${env.port}`);
	});
};

startServer().catch((error) => {
	console.error("Failed to start server", error);
	process.exit(1);
});
