import { Request, Response } from "express";
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

    let timeout = 30000;
    if (req.query.timeout) {
        let tempTimeout = Number(req.query.timeout);
        if (tempTimeout > 0) {
            timeout = tempTimeout;
        }
    }

    let m3u: any = ec_list;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
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
                m3u['#EXTM3U'][i]['url'] = canal8url || baseUrl + m3u['#EXTM3U'][i]['default'];
            } else if (m3u['#EXTM3U'][i]['tvg-id'] === '10') {
                m3u['#EXTM3U'][i]['url'] = canal10url || baseUrl + m3u['#EXTM3U'][i]['default'];
                break;
            }
        }
    
        res.setHeader('Content-Type', 'audio/x-mpegurl');
        res.status(200).send(convertToJsonM3u(m3u));

    }
    
}

// export async function getM3UListEc(req: Request, res: Response) {

//     let timeout = 60000;
//     let m3u: any = ec_list;
//     const baseUrl = `${req.protocol}://${req.get('host')}`;
//     if (req.query.timeout) {
//         let tempTimeout = Number(req.query.timeout);
//         if (tempTimeout > 0) {
//             timeout = tempTimeout;
//         }
//     }


//     try {

//         let canal8url = getCanal8URL(timeout);
//         let canal10url = getCanal10URL(timeout);
    
//         await Promise.all([canal8url, canal10url]).then(urls => {
    
//             console.log(new Date() + " " + "Get m3u list Ec: Channel 8 url: " + urls[0]);
//             console.log(new Date() + " " + "Get m3u list Ec: Channel 10 url: " + urls[1]);

//             for (let i = 0; i < m3u['#EXTM3U'].length; i++) {
//                 if (m3u['#EXTM3U'][i]['tvg-id'] === '8') {
//                     m3u['#EXTM3U'][i]['url'] = urls[0] || baseUrl + ['#EXTM3U'][i]['default'];
//                 } else if (m3u['#EXTM3U'][i]['tvg-id'] === '10') {
//                     m3u['#EXTM3U'][i]['url'] = urls[1] || baseUrl + ['#EXTM3U'][i]['default'];
//                     break;
//                 }
//             }
    
//         });
    
//         res.setHeader('Content-Type', 'audio/x-mpegurl');
//         res.status(200).send(convertToJsonM3u(m3u));

//     } catch(error) {
//         console.error(new Date() + " " + "Get m3u list Ec:", error);
//         res.status(500).json("Lista de canales no disponible");
//     }
    
// }

export async function getLogo(req: Request, res: Response) {

}
