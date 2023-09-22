import { Request, Response, Router } from "express";
import { getCanal8 } from "../services/canales/canal-0008.service";
import { getCanal10 } from "../services/canales/canal-0010.service";

const canalesRouter = Router();

canalesRouter.get("/canal-8.m3u8", (req: Request, res: Response) => getCanal8(res));
canalesRouter.get("/canal-10.m3u8", (req: Request, res: Response) => getCanal10(res));

export default canalesRouter;