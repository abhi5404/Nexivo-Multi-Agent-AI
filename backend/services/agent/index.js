import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";


dotenv.config();

const port = process.env.PORT || 5000;
const app = express();


app.use(express.json());
app.use("/",router);


app.get("/", (req, res) => {
  res.send("Agent service is running");
});

app.listen(port, () => {
  console.log(`Agent service is running on port ${port}`);
});
