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

export default {
	getMonthlyReport,
	getServiceReport,
};
