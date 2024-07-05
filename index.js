import express, { urlencoded } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { dbConnection } from "./utils/Db.js";
import errorHandler from "./middlewares/errorHandler.js";
import { initialize } from "./utils/Socket.js";
import routes from "./routes/entry.js";
// import cors from "cors";

dotenv.config();

//for database connectivity
dbConnection();

const port = process.env.port || 8080;
const app = express();
initialize();

// const corsOption = {
//   origin: "http://10.132.62.10:8081",
// };
// app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(errorHandler);
app.use("/api", routes);

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
