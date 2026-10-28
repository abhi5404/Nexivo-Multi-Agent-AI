import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import router from "./routes/auth.route.js";

dotenv.config();
connectDB();
const port = process.env.PORT || 5000;
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use("/auth", router);

app.get("/", (req, res) => {
  res.send("Auth service is running");
});

app.listen(port, () => {
  console.log(`Auth service is running on port ${port}`);
});
