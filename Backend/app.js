import express from "express";
import {config} from "dotenv";
import cors from "cors"

const app = express();
config({ path: ",/config/config.env"});

app.use(
  cors({
    origin: [process.env.FRONDEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

export default app;