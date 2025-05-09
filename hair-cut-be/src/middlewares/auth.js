import tokenService from "../services/token.service.js";

export function authenticateMiddleware(req, res, next) {
	const token = tokenService.extractTokenFromHeader(req);
	if (!token) return res.status(401).json({ message: "Missing token" });

	try {
		const payload = tokenService.verifyAccessToken(token);
		req.user = payload;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid token" });
	}
}
