import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import "dotenv/config";

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("OK");
});

import canalesRouter from "./routes/canales.routes";
import listaRouter from "./routes/lista.routes";
import logoRouter from "./routes/logo.route";
import {
  generateM3UListEc,
  randomIntFromInterval,
} from "./services/lista.services";

const endpointV1 = "/api/v1";

app.use(endpointV1 + "/canales", canalesRouter);
app.use(endpointV1 + "/listas", listaRouter);
app.use(endpointV1 + "/logos", logoRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

setTimeout(() => {
  if (process.env.ENVIRONMENT !== "develop") {
    console.log(new Date() + " " + "Automated list generation running");
    generateM3UListEc(60000);
  }
}, 1000 * 10);

setInterval(() => {
  if (process.env.ENVIRONMENT !== "develop") {
    console.log(new Date() + " " + "Automated list generation running");
    generateM3UListEc(60000);
  }
}, (1000 * 60 * 40) + randomIntFromInterval(0, 1000 * 60 * 20));
