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
import { generateList, getLists } from "./services/lista.services";
import { startContinuosScrape, firstScrape } from "./services/util.service";

const endpointV1 = "/api/v1";

app.get("/:lista", (req: Request, res: Response) => getLists(req, res));
app.use(endpointV1 + "/listas", listaRouter);
app.use(endpointV1 + "/canales", canalesRouter);
app.use(endpointV1 + "/logos", logoRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
  if (process.env.STRATEGY) {
    console.log("Starting service with strategy: " + process.env.STRATEGY);
  } else {
    console.log("Starting service without strategy: No lists update will be possible");
  }
});

setTimeout(() => {
  generateList();
  firstScrape();
}, 1000 * 2);

if (process.env.ENVIRONMENT === "production" && process.env.STRATEGY === "automated") {
  setTimeout(() => {
    startContinuosScrape();
  }, 1000 * 10);
}