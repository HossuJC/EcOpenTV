import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';
import { ec } from "../resources/const";
import { handleCanalSearch } from "./canal.service";
// import { getCanal8URL } from "./canales/canal-0008.service";
// import { getCanal10URL } from "./canales/canal-0010.service";
// import { getCanalContent } from "./util.service";

export function convertJsonToM3u(jsonInput: any) {
    let result = "#EXTM3U\n";
    for (const item of jsonInput["#EXTM3U"]) {
        let validUrl = "http://null";
        if (item["strategy"] === "direct") {
            validUrl = item["url"]
        } else if (item["strategy"] === "deep") {
            validUrl = item["list-url"]
        } else if (item["strategy"] === "shallow") {
            let fileNameLink = `canal-${item["tvg-id"]}.link`
            let filePathlink = path.join(__dirname, '..', 'channels', fileNameLink);
            if (fs.existsSync(filePathlink)) {
                validUrl = fs.readFileSync(filePathlink, 'utf8');
            }
        }
        result += `#EXTINF:${item["#EXTINF"]} tvg-id="${item["tvg-id"]}" tvg-chno="${item["tvg-chno"]}" tvg-name="${item["tvg-name"]}" tvg-logo="${item["tvg-logo"]}",${item["tvg-name"]}\n${validUrl}\n`;
    }
    return result;
}

export function generateList() {

    const fileName = 'ec.m3u';
    const filePath = path.join(__dirname, '..', 'm3u-lists', fileName);
    console.log(`Generate list: ${fileName}`);
    const content = convertJsonToM3u(ec);
    
    fs.writeFileSync(filePath, content);
    console.log(`Generate list: ${fileName} generated successfully`);

}

export async function generateCanal(req: Request, res: Response) {

    try {
        let canal = req.params.canal;
        let canalObject = canal ? ec["#EXTM3U"].find(e => canal === `canal-${e["tvg-id"]}.m3u8`) : undefined;
        let timeout = req.query.timeout ? Number(req.query.timeout) : 30000;

        if (canal && canalObject) {
            let response = await handleCanalSearch(timeout, canalObject);

            if (response) {
                res.status(200).send("Archivo de canal modificado correctamente");
            } else {
                res.status(500).send("Archivo de canal no modificado");
            }
            
        } else {
            res.status(404).send("Error al generar contenido del canal " + req.params.canal + ": Canal o lista no validos");
        }

    } catch (error) {
        res.status(500).send("Error al generar contenido del canal " + req.params.canal + ":" + error );
    }

}

export async function generateCanales(req: Request, res: Response) {

    let respuesta = await generateCanalesInterno(Number(req.query.timeout));
    if (respuesta && respuesta?.status && respuesta?.message) {
        res.status(respuesta?.status).send(respuesta?.message)
    } else {
        res.status(500).send("Error al generar contenido del canal");
    }

}

export async function generateCanalesInterno(timeout: number) {

    let canalesFallidos: string[] = [];
    let currentChannel: string = "none";

    try {

        for (let canalObject of ec["#EXTM3U"]) {
            currentChannel = canalObject["tvg-id"];
            let result = await handleCanalSearch(timeout ?? 30000, canalObject);
            if (!result) {
                canalesFallidos.push(canalObject["tvg-id"]);
            }
        }

        if (canalesFallidos.length === 0) {
            console.log("Generate channels: Finished with state SUCCESS");
            return {status: 200, message: "Archivos de canales modificados correctamente"};
        } else {
            console.log("Generate channels: Finished with state FAILED");
            console.log("Generate channels: Channels failed: " + canalesFallidos.toString().replaceAll(",", ", "));
            return {status: 500, message: "Archivo de canal no modificado para: " + canalesFallidos.toString().replaceAll(",", ", ")};
        }

    } catch (error) {
        console.log("Generate channels: Finished with state FAILED:" + error );
        console.log("Generate channels: Last attempt: Channel" + currentChannel );
        console.log("Generate channels: Channels failed: " + canalesFallidos.toString().replaceAll(",", ", "));
        return {status: 500, message: "Error al generar contenido de los canales:" + error};
    }

}

// export async function generateAndGetM3UListEc(req: Request, res: Response) {
//     let timeout = Number(process.env.DEFAULT_TIME) || 30000;
//     if (req.query.timeout) {
//         let tempTimeout = Number(req.query.timeout);
//         if (tempTimeout > 0) {
//             timeout = tempTimeout;
//         }
//     }
    
//     await generateStreamContent(timeout);
//     await getM3UListEc(req, res);
// }

export async function getLists(req: Request, res: Response) {

    try {
        const fileName = req.params.lista;
        const filePath = path.join(__dirname, '..', 'm3u-lists', fileName);

        if (fileName && fileName.includes(".m3u") && fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'audio/x-mpegurl');
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            console.error("Channel does not exist");
            res.status(404).send("La lista no esta disponible");
        }
    } catch (error) {
        console.error("Error getting channel:", error);
        res.status(500).send("Error al obtener canal");
    }

    // try {
    //     const fileName = 'ec.m3u';
    //     const filePath = path.join(__dirname, '..', 'm3u-lists', fileName);

    //     if (fs.existsSync(filePath)) { 
    //         res.setHeader('Content-Type', 'audio/x-mpegurl');
    //         const fileStream = fs.createReadStream(filePath);
    //         console.log("Get m3u list: Sending list to " + req.ip);
    //         fileStream.pipe(res);
    //     } else {
    //         console.error("Get m3u list: List does not exist yet");
    //         res.status(404).json("La lista aún no ha sido generada");
    //     }
    // } catch (error) {
    //     console.error("Get m3u list: Error getting list:", error);
    //     res.status(500).json("Error al obtener lista");
    // }

}

// export async function generateStreamContent(timeout) {

//     let m3u: any = ec_list;
    
//     const filePath_m3u = path.join(__dirname, '..', 'm3u-lists', 'ec.m3u');
//     const filePath_canal10_m3u8 = path.join(__dirname, '..', 'm3u-lists', 'canal-10.m3u8');
//     const filePath_canal8_link = path.join(__dirname, '..', 'm3u-lists', 'canal-8.link');
//     const filePath_canal10_link = path.join(__dirname, '..', 'm3u-lists', 'canal-10.link');
    
//     let canal8url;
//     let canal10url;

//     try {

//         canal8url = await getCanal8URL(timeout);
//         if (!canal8url) canal8url = await getCanal8URL(timeout, true);
//         canal10url = await getCanal10URL(timeout);

//         if (canal8url) {
//             fs.writeFileSync(filePath_canal8_link, canal8url);
//             console.log("Generate stream content: Channel 8 link found and written to storage: " + canal8url);
//         } else {
//             console.log("Generate stream content: Channel 8 link not found on internet, trying to get it from storage");
//             if (fs.existsSync(filePath_canal8_link)) {
//                 fs.readFile(filePath_canal8_link, (err, data) => {
//                     if (err) {
//                         console.error("Generate stream content: Error reading storage:" + err);
//                     } else {
//                         canal8url = data;
//                         console.log("Generate stream content: Channel 8 link found: " + canal8url);
//                     }
//                 });
//             } else {
//                 console.log("Generate stream content: Channel 8 link not found on storage");
//             }
//         }
        
//         if (canal10url) {
//             fs.writeFileSync(filePath_canal10_link, canal10url);
//             console.log("Generate stream content: Channel 10 link found and written to storage: " + canal10url);
//         } else {
//             console.log("Generate stream content: Channel 10 link not found on internet, trying to get it from storage");
//             if (fs.existsSync(filePath_canal10_link)) {
//                 fs.readFile(filePath_canal10_link, (err, data) => {
//                     if (err) {
//                         console.error("Generate stream content: Error reading storage:" + err);
//                     } else {
//                         canal10url = data;
//                         console.log("Generate stream content: Channel 10 link found: " + canal10url);
//                     }
//                 });
//             } else {
//                 console.log("Generate stream content: Channel 10 link not found on storage");
//             }
//         }

//         if (canal10url) {
//             let canal10Content = await getCanalContent(canal10url);
//             console.log("Generate stream content: Channel 10 content being fetched");
//             if (canal10Content && canal10Content.startsWith('#EXTM3U')) {
//                 fs.writeFileSync(filePath_canal10_m3u8, canal10Content);
//                 console.log("Generate stream content: Channel 10 content found and written to storage");
//             } else {
//                 if (fs.existsSync(filePath_canal10_m3u8)) {
//                     console.log("Generate stream content: Channel 10 content not found, storage content will be used instead");
//                 } else {
//                     console.log("Generate stream content: Channel 10 content not found, storage content not available");
//                 }
//             }
//         } else {
//             if (fs.existsSync(filePath_canal10_m3u8)) {
//                 console.log("Generate stream content: Channel 10 content can not be fetched, storage content will be used instead");
//             } else {
//                 console.log("Generate stream content: Channel 10 content can not be fetched, storage content not available");
//             }
//         }

//     } catch(error) {

//         console.error("Generate stream content:", error);

//     } finally {

//         console.log("Generate stream content: Generating list");
//         for (let i = 0; i < m3u['#EXTM3U'].length; i++) {
//             if (m3u['#EXTM3U'][i]['tvg-id'] === '8') {
//                 m3u['#EXTM3U'][i]['url'] = canal8url || 'http://null';
//             } else if (m3u['#EXTM3U'][i]['tvg-id'] === '10') {
//                 m3u['#EXTM3U'][i]['url'] = m3u['#EXTM3U'][i]['default'];
//                 break;
//             }
//         }

//         let listContent = convertJsonToM3u(m3u);
//         fs.writeFileSync(filePath_m3u, listContent);
//         console.log("Generate stream content: List has been written to storage and is ready to use");

//         return listContent;

//     }
    
// }