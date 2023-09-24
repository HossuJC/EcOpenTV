import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';
import ec_list from "../m3u-lists/ec_list";
import { getCanal8URL } from "./canales/canal-0008.service";
import { getCanal10URL } from "./canales/canal-0010.service";

export function convertJsonToM3u(jsonInput: any) {
    let result = "#EXTM3U\n";
    for (const item of jsonInput["#EXTM3U"]) {
        result += `#EXTINF:${item["#EXTINF"]} tvg-id="${item["tvg-id"]}" tvg-chno="${item["tvg-chno"]}" tvg-name="${item["tvg-name"]}" tvg-logo="${item["tvg-logo"]}",${item["tvg-name"]}\n${item["url"]}\n`;
    }
    return result;
}

export async function getM3UListEc(req: Request, res: Response) {

    try {
        const fileName = req.url.split('/')[1].split('?')[0];
        const filePath = path.join(__dirname, '..', 'm3u-lists', fileName);
    
        if (fs.existsSync(filePath)) { 
            res.setHeader('Content-Type', 'audio/x-mpegurl');
            const fileStream = fs.createReadStream(filePath);
            console.log(new Date() + " " + "getM3UListEc: Sending list to " + req.ip);
            fileStream.pipe(res);
        } else {
            console.error(new Date() + " " + "List does not exist yet");
            res.status(404).json("La lista aún no ha sido generada");
        }
    } catch (error) {
        console.error(new Date() + " " + "Error getting list:", error);
        res.status(500).json("Error al obtener lista");
    }

}

export async function generateAndSendM3UListEc(req: Request, res: Response) {
    let timeout = Number(process.env.DEFAULT_TIME) || 30000;
    if (req.query.timeout) {
        let tempTimeout = Number(req.query.timeout);
        if (tempTimeout > 0) {
            timeout = tempTimeout;
        }
    }
    
    let listContent = await generateM3UListEc(timeout);
    
    res.setHeader('Content-Type', 'audio/x-mpegurl');
    res.status(200).send(listContent);
}

export async function generateM3UListEc(timeout) {

    let m3u: any = ec_list;
    
    const filePath = path.join(__dirname, '..', 'm3u-lists', 'ec.m3u');
    
    let canal8url;
    let canal10url;

    try {

        canal8url = await getCanal8URL(timeout);
        canal10url = await getCanal10URL(timeout);
    
        console.log(new Date() + " " + "Get m3u list Ec: Channel 8 url: " + canal8url ?? "Using default");
        console.log(new Date() + " " + "Get m3u list Ec: Channel 10 url: " + canal10url ?? "Using default");

    } catch(error) {

        console.error(new Date() + " " + "Get m3u list Ec:", error);

    } finally {

        for (let i = 0; i < m3u['#EXTM3U'].length; i++) {
            if (m3u['#EXTM3U'][i]['tvg-id'] === '8') {
                m3u['#EXTM3U'][i]['url'] = canal8url || m3u['#EXTM3U'][i]['default'];
            } else if (m3u['#EXTM3U'][i]['tvg-id'] === '10') {
                m3u['#EXTM3U'][i]['url'] = canal10url || m3u['#EXTM3U'][i]['default'];
                break;
            }
        }

        let listContent = convertJsonToM3u(m3u);
        fs.writeFileSync(filePath, listContent);

        return listContent;

    }
    
}

export function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}