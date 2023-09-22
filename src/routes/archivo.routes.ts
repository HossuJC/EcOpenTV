import { Request, Response, Router } from "express";
import { getLogo, getM3UListEc } from "../services/archivo.services";

const archivosRouter = Router();

archivosRouter.get("/ec_list.m3u", (req: Request, res: Response) => getM3UListEc(req, res));
archivosRouter.get("/image/:logo", (req: Request, res: Response) => getLogo(req, res));

export default archivosRouter;