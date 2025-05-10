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

// Middleware kiểm tra role admin
export function isAdmin(req, res, next) {
	if (req.user.role !== 'admin') {
			return res.status(403).json({ message: "Access denied. Admin only." });
	}
	next();
}

// Middleware kiểm tra quyền quản lý sản phẩm
export function canManageProducts(req, res, next) {
	if (!['admin', 'manager'].includes(req.user.role)) {
			return res.status(403).json({ message: "Access denied. Insufficient permissions." });
	}
	next();
}

