import { Request, Response } from "express";
import fs from "fs";
import ec_list from "../../m3u-lists/ec_list";
import { getCanal8URL } from "./canales/canal-0008.service";
import { getCanal10URL } from "./canales/canal-0010.service";

export function convertToJsonM3u(jsonInput: any) {
    let result = "#EXTM3U\n";
    for (const item of jsonInput["#EXTM3U"]) {
        result += `#EXTINF:${item["#EXTINF"]} tvg-id="${item["tvg-id"]}" tvg-chno="${item["tvg-chno"]}" tvg-name="${item["tvg-name"]}" tvg-logo="${item["tvg-logo"]}",${item["tvg-name"]}\n${item["url"]}\n`;
    }
    return result;
}

export async function getM3UListEc(req: Request, res: Response) {

    try {

        let canal8url = getCanal8URL();
        let canal10url = getCanal10URL(30000);
        let m3u: any = ec_list;
    
        await Promise.all([canal8url, canal10url]).then(urls => {
    
            console.log(new Date() + " " + "Get m3u list Ec: Channel 8 url: " + urls[0]);
            console.log(new Date() + " " + "Get m3u list Ec: Channel 10 url: " + urls[1]);
            
            for (let i = 0; i < m3u['#EXTM3U'].length; i++) {
                if (m3u['#EXTM3U'][i]['tvg-id'] === '8') {
                    m3u['#EXTM3U'][i]['url'] = urls[0] || null;
                } else if (m3u['#EXTM3U'][i]['tvg-id'] === '10') {
                    m3u['#EXTM3U'][i]['url'] = urls[1] || null;
                    break;
                }
            }
    
        });
    
        res.setHeader('Content-Type', 'audio/x-mpegurl');
        res.status(200).send(convertToJsonM3u(m3u));

    } catch(error) {
        console.error(new Date() + " " + "Get m3u list Ec:", error);
        res.status(500).json("Lista no disponible");
    }
    
}

export async function getLogo(req: Request, res: Response) {

}
