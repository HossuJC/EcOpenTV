import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';

export async function getLogo(req: Request, res: Response) {

    try {
        const fileName = req.params.logo;
        const filePath = path.join(__dirname, '..', '..', 'm3u-lists', 'assets', fileName);
    
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'image/png');

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        console.error(new Date() + " " + "Error getting logo:", error);
        res.status(500).json("Error al obtener logo");
    }

}