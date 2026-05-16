const express = require("express");
const { z } = require("zod");
const { signup, login, getMe } = require("../controllers/auth.controller");
const { validateBody } = require("../middlewares/validate.middleware");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

const signupSchema = z.object({
	name: z.string().min(2).max(100),
	email: z.string().email().max(255),
	password: z.string().min(8).max(100),
});

const loginSchema = z.object({
	email: z.string().email().max(255),
	password: z.string().min(8).max(100),
});

router.post("/signup", validateBody(signupSchema), signup);
router.post("/login", validateBody(loginSchema), login);
router.get("/me", requireAuth, getMe);

module.exports = router;
