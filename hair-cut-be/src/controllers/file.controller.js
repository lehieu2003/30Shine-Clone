import upload from "../middlewares/upload.js";
import { unlink } from "fs";
const uploadSingleFile = [
	upload.single("file"),
	(req, res) => {
		if (!req.file)
			return res.status(400).json({ error: "No file uploaded" });
		res.json({ url: "/" + req.file.path });
	},
];

const uploadMultipleFiles = [
	upload.array("files", 10),
	(req, res) => {
		if (!req.files?.length)
			return res.status(400).json({ error: "No files uploaded" });

		res.json({ urls: req.files.map((file) => "/" + file.path) });
	},
];
const deleteFile = [
	(req, res) => {
		const filePath = req.body.filePath;
		if (!filePath)
			return res.status(400).json({ error: "No file path provided" });
		// Logic to delete the file from the server
		unlink(filePath, (err) => {
			if (err) console.error("Error deleting file:", err);
			else console.log("File deleted successfully:", filePath);
		});
		res.json({ message: "File deleted successfully" });
	},
];
export default { uploadSingleFile, uploadMultipleFiles, deleteFile };
