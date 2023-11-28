import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';
import { ec } from "../resources/const";
import { handleCanalSearch } from "./canal.service";
import { checkLastRunAndScrape } from "./util.service";

export function convertJsonToM3u(jsonInput: any) {
    let result = "#EXTM3U\n\n";
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
        result += `#EXTINF:${item["#EXTINF"]} tvg-id="${item["tvg-id"]}" tvg-chno="${item["tvg-chno"]}" tvg-name="${item["tvg-name"]}" tvg-logo="${item["tvg-logo"]}",${item["tvg-name"]}\n${validUrl}\n\n`;
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

    let lastRunPath: string = path.join(__dirname, '..', 'resources', "lastRun.txt");

    try {

        fs.writeFileSync(lastRunPath, Date.now().toString());

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
        
        if (process.env.STRATEGY === "trigger") {
            checkLastRunAndScrape();
        }

    } catch (error) {
        console.error("Error getting channel:", error);
        res.status(500).send("Error al obtener canal");
    }

}
