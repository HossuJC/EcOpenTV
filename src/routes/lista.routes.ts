import { Request, Response, Router } from "express";
import { generateCanal, generateCanales, getLists } from "../services/lista.services";

const listaRouter = Router();

listaRouter.get("/generate/:canal", (req: Request, res: Response) => generateCanal(req, res));
listaRouter.get("/generate", (req: Request, res: Response) => generateCanales(req, res));
listaRouter.get("/:lista", (req: Request, res: Response) => getLists(req, res));

export default listaRouter;