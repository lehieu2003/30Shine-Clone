import express from "express";
import apiRoute from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.get("/api", (req, res) => {
	res.send("Hello World!");
});

app.use("/api", apiRoute);

export default app;
