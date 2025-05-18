import express from "express";
import serviceRouter from "./service.route.js";
import fileRouter from "./file.routes.js";
import stepRouter from "./step.route.js";
import authRouter from "./auth.route.js";
import bookingRouter from "./booking.route.js";
import userRouter from "./user.route.js";
import reportRouter from "./report.route.js";
import productRouter from "./product.route.js";
import cartRouter from "./cart.routes.js";
import paymentRouter from "./payment.routes.js";
import branchRouter from "./branch.route.js";
import branchEmployeeRouter from "./branchEmployee.route.js";

const apiRoute = express.Router();

apiRoute.use("/services", serviceRouter);
apiRoute.use("/files", fileRouter);
apiRoute.use("/steps", stepRouter);
apiRoute.use("/auth", authRouter);
apiRoute.use("/bookings", bookingRouter);
apiRoute.use("/users", userRouter);
apiRoute.use("/reports", reportRouter);
apiRoute.use("/products", productRouter);
apiRoute.use("/cart", cartRouter);
apiRoute.use("/payment", paymentRouter);
apiRoute.use("/branches", branchRouter);
apiRoute.use("/branch-employees", branchEmployeeRouter);

export default apiRoute;
