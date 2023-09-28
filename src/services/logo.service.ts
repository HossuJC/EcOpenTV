import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';

export async function getLogo(req: Request, res: Response) {

    try {
        const fileName = req.params.logo;
        const filePath = path.join(__dirname, '..', '..', 'src', 'assets', fileName);

        if (fileName && fileName.includes(".png") && fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'image/png');
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            console.error("Logo does not exist");
            res.status(404).send("El logo no existe");
        }
    } catch (error) {
        console.error("Error getting logo:", error);
        res.status(500).send("Error al obtener logo");
    }

}
