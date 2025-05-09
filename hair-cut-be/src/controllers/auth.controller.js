import { authenticateMiddleware } from "../middlewares/auth.js";
import authService, {
	loginSchema,
	registerSchema,
} from "../services/auth.service.js";
import { processRequestBody } from "zod-express-middleware";

const registerUser = [
	processRequestBody(registerSchema),
	async (req, res) => {
		return res.status(201).json(await authService.registerUser(req.body));
	},
];

const loginUser = [
	processRequestBody(loginSchema),
	async (req, res) => {
		return res.status(200).json(await authService.loginUser(req.body));
	},
];

const getCurrentUser = [
	authenticateMiddleware,
	async (req, res) => {
		const user = req.user;
		if (!user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		return res.status(200).json(user);
	},
];

const isPhoneRegistered = [
	async (req, res) => {
		// from query params
		const { phone } = req.query;
		if (!phone)
			return res.status(400).json({ message: "Phone is required" });
		const isRegistered = await authService.isPhoneRegistered(phone);
		return res.status(200).json({ isRegistered });
	},
];

const isEmailRegistered = [
	async (req, res) => {
		const { email } = req.query;
		if (!email)
			return res.status(400).json({ message: "Email is required" });
		const isRegistered = await authService.isEmailRegistered(email);
		return res.status(200).json({ isRegistered });
	},
];

export default {
	registerUser,
	loginUser,
	getCurrentUser,
	isPhoneRegistered,
	isEmailRegistered,
};
