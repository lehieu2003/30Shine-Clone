import express from "express";
import apiRoute from "./routes/index.js";

const app = express();

// config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// config CORS
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header("Access-Control-Allow-Credentials", "true");
	
	// Handle preflight requests
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	
	next();
});
// config static files
app.use(express.static("public"));
// config uploads folder
app.use("/uploads", express.static("uploads"));

app.get("/api", (req, res) => {
	res.send("Hello World!");
});

app.use("/api", apiRoute);

export default app;
