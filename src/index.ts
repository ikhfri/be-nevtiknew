import express from "express";
import cors from "cors";
import authRouter from "./routes/user.route";
import candiatesRouter from "./routes/candidate.route";
import cookieParser from "cookie-parser";
import voteRouter from "./routes/vote.route";

const app = express();
const PORT = 8000;
app.use(
  cors({
    origin: "http://localhost:4000",
    credentials:true,
})
);
app.get("/", (req, res) => {
  res.send("API is Running");
})
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/candidates", candiatesRouter)
app.use("/vote", voteRouter)
app.use("/uploads", express.static("images"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app