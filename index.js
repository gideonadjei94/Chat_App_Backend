import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { dbConnection } from "./utils/Db.js";
import errorHandler from "./middlewares/errorHandler.js";
import { initialize } from "./utils/Socket.js";
import routes from "./routes/entry.js";
import cors from "cors";

dotenv.config();

//for database connectivity
dbConnection();

const port = process.env.port || 8080;
const app = express();
initialize();

const corsOption = {
  origin: "*",
};
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(errorHandler);
app.use("/api", routes);

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
