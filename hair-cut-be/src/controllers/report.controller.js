import reportService from "../services/report.service.js";

const getMonthlyReport = [
	async (req, res) => {
		return res
			.status(200)
			.json(await reportService.getMonthlyRevenueTable(req.query));
	},
];

const getServiceReport = [
	async (req, res) => {
		return res
			.status(200)
			.json(await reportService.getRevenueByServiceTable(req.query));
	},
];

const getDashboardStats = [
	async (req, res) => {
		try {
			const stats = await reportService.getDashboardStats();
			return res.status(200).json({ data: stats });
		} catch (error) {
			console.error("Error fetching dashboard stats:", error);
			return res.status(500).json({
				message: "Failed to fetch dashboard statistics",
				error: error.message,
			});
		}
	},
];

const getRecentActivities = [
	async (req, res) => {
		try {
			const { limit = 5 } = req.query;
			const activities = await reportService.getRecentActivities(limit);
			return res.status(200).json({ data: activities });
		} catch (error) {
			console.error("Error fetching recent activities:", error);
			return res.status(500).json({
				message: "Failed to fetch recent activities",
				error: error.message,
			});
		}
	},
];

export default {
	getMonthlyReport,
	getServiceReport,
	getDashboardStats,
	getRecentActivities,
};
