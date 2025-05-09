import { z } from "zod";
import db from "../database/index.js";
import tokenService from "./token.service.js";

export const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	fullName: z.string().min(1),
	phone: z.string().optional(),
});

export const loginSchema = z.object({
	username: z.string().min(1),
	password: z.string().min(3),
});

const registerUser = async (payload) => {
	const { email, password, fullName, phone } = payload;
	console.log("Registering user", payload);
	try {
		const user = await db.user.create({
			data: {
				email,
				password,
				phone,
				fullName,
				availabilityStatus: "available",
				createdAt: new Date(),
				role: "customer",
				status: "active",
			},
		});

		return {
			id: user.id,
			role: user.role,
			fullName: user.fullName,
			phone: user.phone,
		};
	} catch (err) {
		throw new Error(err.message);
	}
};

const loginUser = async (payload) => {
	const { username, password } = payload;
	try {
		const user = await db.user.findFirst({
			where: {
				OR: [{ email: username }, { phone: username }],
			},
		});
		if (!user) throw new Error("User not found");
		if (user.status !== "active") throw new Error("User is not active");
		if (user.password !== password) throw new Error("Invalid password");
		const accessToken = tokenService.signAccessToken({
			id: user.id,
			email: user.email,
			role: user.role,
			phone: user.phone,
			fullName: user.fullName,
		});
		return {
			accessToken,
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
				fullName: user.fullName,
				phone: user.phone,
				availabilityStatus: user.availabilityStatus,
				status: user.status,
			},
		};
	} catch (err) {
		throw new Error(err.message);
	}
};

const getUserByPhoneOrCreate = async (phone) => {
	try {
		const user = await db.user.findFirst({
			where: {
				phone,
			},
		});
		if (!user) {
			return await registerUser({
				phone,
				password: phone,
				fullName: phone,
				email: phone,
			});
		}
		return user;
	} catch (err) {
		throw new Error(err.message);
	}
};

const isPhoneRegistered = async (phone) => {
	try {
		const user = await db.user.findFirst({
			where: {
				phone,
			},
		});
		return !!user;
	} catch (err) {
		throw new Error(err.message);
	}
};
const isEmailRegistered = async (email) => {
	try {
		const user = await db.user.findFirst({
			where: {
				email,
			},
		});
		return !!user;
	} catch (err) {
		throw new Error(err.message);
	}
};

export default {
	registerUser,
	loginUser,
	getUserByPhoneOrCreate,
	isPhoneRegistered,
	isEmailRegistered,
};
