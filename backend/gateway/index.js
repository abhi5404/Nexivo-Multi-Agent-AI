import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import proxy from "express-http-proxy";
import cors from "cors";
import protect from "./middleware/auth.middleware.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";
import redis from "../shared/redis/redis.js";


dotenv.config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());
app.use("/api/agent", protect, proxyWithHeader(process.env.AGENT_SERVICE, "/api/agent"));
app.post("/api/auth/logout", async (req, res) => {
  try {
    const sessionId = req.cookies?.sessionId;

    if (sessionId) {
      await redis.del(`session-${sessionId}`);
    }

    res.clearCookie("sessionId", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout failed:", error.message);
    return res.status(500).json({ message: "Logout failed" });
  }
});
app.use("/api/auth", proxy(process.env.AUTH_SERVICE, {
  proxyReqPathResolver: (req) => req.originalUrl.replace(/^\/api\/auth/, "/auth"),
}));
app.use("/api/chat", protect, proxyWithHeader(process.env.CHAT_SERVICE, "/api/chat"));

app.get("/api/me", protect, getCurrentUser);

app.get("/", (req, res) => {
  res.send("Gateway is running");
});

app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
});
