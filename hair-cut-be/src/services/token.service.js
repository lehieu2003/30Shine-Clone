import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-secret";
const ACCESS_EXPIRES = "7d";
const REFRESH_EXPIRES = "30d";

const tokenService = {
	signAccessToken(payload) {
		return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
	},

	signRefreshToken(payload) {
		return jwt.sign(payload, REFRESH_SECRET, {
			expiresIn: REFRESH_EXPIRES,
		});
	},

	verifyAccessToken(token) {
		return jwt.verify(token, ACCESS_SECRET);
	},

	verifyRefreshToken(token) {
		return jwt.verify(token, REFRESH_SECRET);
	},

	decode(token) {
		return jwt.decode(token);
	},

	extractTokenFromHeader(req) {
		const authHeader = req.headers["authorization"];
		if (!authHeader?.startsWith("Bearer ")) return null;
		return authHeader.split(" ")[1];
	},
};

export default tokenService;
