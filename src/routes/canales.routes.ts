import { Request, Response, Router } from "express";
import { getCanal } from "../services/canal.service";

const canalesRouter = Router();

canalesRouter.get("/:canal", (req: Request, res: Response) => getCanal(req, res));

export default canalesRouter;