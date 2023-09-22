import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("OK");
});

import canalesRouter from "./routes/canales.routes";
import archivosRouter from "./routes/archivo.routes";

const endpointV1 = "/api/v1"

app.use(endpointV1 + "/canales", canalesRouter);
app.use(endpointV1 + "/archivos", archivosRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
