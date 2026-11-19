import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import router from "./routes/agent.route.js";

const port = process.env.PORT || 5000;
const app = express();


app.use(express.json());
app.use("/",router);

connectDB();


app.get("/", (req, res) => {
  res.send("Agent service is running");
});

app.listen(port, () => {
  console.log(`Agent service is running on port ${port}`);
});
