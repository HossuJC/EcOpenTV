import { Request, Response, Router } from "express";
import { getCanal } from "../services/canal.service";
// import { getCanal8 } from "../services/canales/canal-0008.service";
// import { getCanal10 } from "../services/canales/canal-0010.service";

const canalesRouter = Router();

// canalesRouter.get("/link/canal-8.m3u8", (req: Request, res: Response) => getCanal8(req, res));
// canalesRouter.get("/link/canal-10.m3u8", (req: Request, res: Response) => getCanal10(req, res));
canalesRouter.get("/:canal", (req: Request, res: Response) => getCanal(req, res));

export default canalesRouter;