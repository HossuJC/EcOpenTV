import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export async function getCanal(req: Request, res: Response) {

    try {
        const fileName = req.params.canal;
        const filePath = path.join(__dirname, '..', 'm3u-lists', fileName);

        if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            console.error("Canal does not exist");
            res.status(404).json("El canal no esta disponible");
        }
    } catch (error) {
        console.error("Error getting canal:", error);
        res.status(500).json("Error al obtener canal");
    }

}