import { Request, Response, Router } from "express";
import { getLogo } from "../services/logo.service";

const logoRouter = Router();

logoRouter.get("/:logo", (req: Request, res: Response) => getLogo(req, res));

export default logoRouter;