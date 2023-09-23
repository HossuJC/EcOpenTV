import { Request, Response, Router } from "express";
import { generateAndSendM3UListEc, getM3UListEc } from "../services/lista.services";

const listaRouter = Router();

listaRouter.get("/ec.m3u", (req: Request, res: Response) => getM3UListEc(req, res));
listaRouter.get("/generate/ec.m3u", (req: Request, res: Response) => generateAndSendM3UListEc(req, res));

export default listaRouter;