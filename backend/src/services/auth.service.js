const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { signToken } = require("../utils/jwt");

const toSafeUser = (user) => ({
	id: user._id,
	name: user.name,
	email: user.email,
	role: user.role,
	createdAt: user.createdAt,
	updatedAt: user.updatedAt,
});

const signupUser = async ({ name, email, password }) => {
	const existing = await User.findOne({ email });
	if (existing) {
		const error = new Error("Email already in use");
		error.status = 409;
		throw error;
	}

	const passwordHash = await bcrypt.hash(password, 10);
	const user = await User.create({ name, email, passwordHash, role: "user" });
	const token = signToken({ id: user._id, role: user.role });

	return {
		token,
		user: toSafeUser(user),
	};
};

const loginUser = async ({ email, password }) => {
	const user = await User.findOne({ email });
	if (!user) {
		const error = new Error("Invalid credentials");
		error.status = 401;
		throw error;
	}

	const matches = await bcrypt.compare(password, user.passwordHash);
	if (!matches) {
		const error = new Error("Invalid credentials");
		error.status = 401;
		throw error;
	}

	const token = signToken({ id: user._id, role: user.role });
	return {
		token,
		user: toSafeUser(user),
	};
};

const getUserProfile = async (userId) => {
	const user = await User.findById(userId);
	if (!user) {
		const error = new Error("User not found");
		error.status = 404;
		throw error;
	}

	return { user: toSafeUser(user) };
};

module.exports = {
	signupUser,
	loginUser,
	getUserProfile,
};
