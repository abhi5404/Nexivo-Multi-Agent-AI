import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/chat.routes.js";


dotenv.config();
connectDB();

const port = process.env.PORT || 5000;
const app = express();


app.use(express.json());
app.use("/", router);


app.get("/", (req, res) => {
  res.send("Auth service is running");
});

app.listen(port, () => {
  console.log(`Chat service is running on port ${port}`);
});
