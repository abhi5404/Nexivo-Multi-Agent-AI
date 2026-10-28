import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cors from "cors";


dotenv.config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));


app.use(express.json());
app.use("/auth", proxy(process.env.AUTH_SERVICE, {
  proxyReqPathResolver: (req) => req.originalUrl
}));

app.get("/", (req, res) => {
  res.send("Gateway is running");
});

app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
});
