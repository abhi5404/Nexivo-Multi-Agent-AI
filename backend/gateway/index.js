import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import proxy from "express-http-proxy";
import cors from "cors";
import protect from "./middleware/auth.middleware.js";
import { getCurrentUser } from "./controllers/user.controller.js";


dotenv.config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", proxy(process.env.AUTH_SERVICE, {
  proxyReqPathResolver: (req) => req.originalUrl.replace(/^\/api/, "")
}));

app.get("/api/me", protect, getCurrentUser);

app.get("/", (req, res) => {
  res.send("Gateway is running");
});

app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
});
