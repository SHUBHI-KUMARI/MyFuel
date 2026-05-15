const {
  signupUser,
  loginUser,
  getUserProfile,
} = require("../services/auth.service");

const signup = async (req, res, next) => {
  try {
    const result = await signupUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const result = await getUserProfile(req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
	signup,
	login,
	getMe,
};
