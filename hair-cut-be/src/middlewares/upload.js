import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 } from "uuid";
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadDir),
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		const name = v4() + "-" + Math.round(Math.random() * 1e9) + ext;
		cb(null, name);
	},
});

const upload = multer({ storage });

export default upload;
