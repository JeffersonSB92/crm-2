import express from "express";
import cors from "cors";
import emailRoutes from "./routes/emailRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/emails", emailRoutes);

export default app;
