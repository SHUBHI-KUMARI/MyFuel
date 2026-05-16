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

const signup = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;

		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(409).json({ message: "Email already in use" });
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, passwordHash, role: "user" });
		const token = signToken({ id: user._id, role: user.role });

		return res.status(201).json({
			token,
			user: toSafeUser(user),
		});
	} catch (error) {
		return next(error);
	}
};

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const matches = await bcrypt.compare(password, user.passwordHash);
		if (!matches) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = signToken({ id: user._id, role: user.role });

		return res.status(200).json({
			token,
			user: toSafeUser(user),
		});
	} catch (error) {
		return next(error);
	}
};

const getMe = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		return res.status(200).json({ user: toSafeUser(user) });
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	signup,
	login,
	getMe,
};
