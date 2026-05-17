const bcrypt = require("bcryptjs");
const env = require("./config/env");
const { connectDb } = require("./config/db");
const User = require("./models/user.model");
const Order = require("./models/order.model");

const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000);
const hoursFromNow = (hours) => new Date(Date.now() + hours * 60 * 60 * 1000);

const seed = async () => {
	const connection = await connectDb(env.mongoUri);
	try {
		await Order.deleteMany({});
		await User.deleteMany({});

		const [adminHash, userHash] = await Promise.all([
			bcrypt.hash("TestAdmin123!", 10),
			bcrypt.hash("TestUser123!", 10),
		]);

		await User.create({
			name: "Vishal Admin",
			email: "admin@myfuel.test",
			passwordHash: adminHash,
			role: "admin",
		});

		const users = await User.create([
			{
				name: "Rahul Mehta",
				email: "user@myfuel.test",
				passwordHash: userHash,
				role: "user",
			},
			{
				name: "Aisha Patel",
				email: "aisha@myfuel.test",
				passwordHash: userHash,
				role: "user",
			},
			{
				name: "Daniel Obi",
				email: "daniel@myfuel.test",
				passwordHash: userHash,
				role: "user",
			},
		]);

		const [rahul, aisha, daniel] = users;

		const orders = [
			{
				userId: rahul._id,
				fuelType: "Petrol",
				quantity: 120,
				deliveryLocation: "MG Road, Bengaluru",
				preferredDeliveryTime: hoursFromNow(6),
				status: "Pending",
				createdAt: hoursAgo(18),
				updatedAt: hoursAgo(18),
			},
			{
				userId: rahul._id,
				fuelType: "Diesel",
				quantity: 320,
				deliveryLocation: "Hinjewadi Phase 2, Pune",
				preferredDeliveryTime: hoursFromNow(24),
				status: "Delivered",
				createdAt: daysAgo(12),
				updatedAt: daysAgo(10),
			},
			{
				userId: aisha._id,
				fuelType: "Premium Petrol",
				quantity: 90,
				deliveryLocation: "Gachibowli, Hyderabad",
				preferredDeliveryTime: hoursFromNow(4),
				status: "Accepted",
				createdAt: daysAgo(3),
				updatedAt: daysAgo(2),
			},
			{
				userId: aisha._id,
				fuelType: "Diesel",
				quantity: 200,
				deliveryLocation: "Navrangpura, Ahmedabad",
				preferredDeliveryTime: hoursFromNow(12),
				status: "Out for Delivery",
				createdAt: daysAgo(2),
				updatedAt: daysAgo(1),
			},
			{
				userId: daniel._id,
				fuelType: "CNG",
				quantity: 70,
				deliveryLocation: "Indiranagar, Bengaluru",
				status: "Pending",
				createdAt: hoursAgo(6),
				updatedAt: hoursAgo(6),
			},
			{
				userId: daniel._id,
				fuelType: "Diesel",
				quantity: 500,
				deliveryLocation: "Whitefield, Bengaluru",
				preferredDeliveryTime: hoursFromNow(36),
				status: "Delivered",
				createdAt: daysAgo(20),
				updatedAt: daysAgo(18),
			},
		];

		await Order.insertMany(orders);

		console.log("Seed complete: 1 admin, 3 users, 6 orders");
	} catch (error) {
		console.error("Seed failed", error);
		process.exitCode = 1;
	} finally {
		await connection.close();
	}
};

seed();
