import { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import https from "https";
import path from 'path';
import fs from 'fs';
import { channel_template } from '../resources/const';
import { checkLastRunAndScrape } from './util.service';

export async function getCanal(req: Request, res: Response) {

    try {
        const fileName = req.params.canal;
        const filePath = path.join(__dirname, '..', 'channels', fileName);

        if (fileName && fileName.includes(".m3u8") && fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            console.error("Channel does not exist");
            res.status(404).send("El canal no esta disponible");
        }
        
        if (process.env.STRATEGY === "trigger") {
            checkLastRunAndScrape();
        }

    } catch (error) {
        console.error("Error getting channel:", error);
        res.status(500).send("Error al obtener canal");
    }

}

export async function handleCanalSearch(timeout: number = 30000, channelObject: Object) {

    let url;
    let content;
    let success = false;
        
    const fileNameLink = `canal-${channelObject["tvg-id"]}.link`
    const filePathlink = path.join(__dirname, '..', 'channels', fileNameLink);
    
    const fileNameM3U8 = `canal-${channelObject["tvg-id"]}.m3u8`
    const filePathM3U8 = path.join(__dirname, '..', 'channels', fileNameM3U8);

    console.log(`Handle search of channel ${channelObject["tvg-id"]}`);

    if (channelObject["strategy"] === 'direct' || channelObject["strategy"] === 'shallow' || channelObject["strategy"].includes('deep')) {
        console.log(`Handle search of channel ${channelObject["tvg-id"]}: Using strategy: ${channelObject["strategy"]}`);

        url = channelObject["strategy"] === 'direct' ? channelObject["url"] : await getCanalURL(timeout, channelObject["tvg-id"], channelObject["options"]);

        if (url) {
            console.log(`Handle search of channel ${channelObject["tvg-id"]}: Url gotten from: ${channelObject["strategy"] === 'direct' ? 'storage' : 'internet'}`);
            console.log(`Handle search of channel ${channelObject["tvg-id"]}: Url found: ${url}`);
            
            fs.writeFileSync(filePathlink, url);
            console.log(`Handle search of channel ${channelObject["tvg-id"]}: Url file written down`);

            if (channelObject["strategy"] === 'direct' || channelObject["strategy"] === 'shallow') {
                content = channel_template.replace('replace_link_here', url);
                console.log(`Handle search of channel ${channelObject["tvg-id"]}: Content generated from template`);
            } else {
                content = await getCanalContent(url, channelObject["tvg-id"]);
                console.log(`Handle search of channel ${channelObject["tvg-id"]}: Content fetched from internet`);
            }

            if (content && content.includes('#EXTM3U')) {
                fs.writeFileSync(filePathM3U8, content);
                console.log(`Handle search of channel ${channelObject["tvg-id"]}: Content validated and written down on file`);
                success = true;
            } else {
                console.log(`Handle search of channel ${channelObject["tvg-id"]}: Content not found or not valid`);
            }

        } else {
            console.log(`Handle search of channel ${channelObject["tvg-id"]}: Url not found, file remains intact`);
        }

    } else {
        console.log(`Handle search of channel ${channelObject["tvg-id"]}: Strategy not provided`);
    }

    console.log(`Handle search of channel ${channelObject["tvg-id"]}: Finished with state ${success ? 'SUCCESS' : 'FAILED'}`);
    return success;

}

export async function getCanalContent(url: string, channelId: string): Promise<string> {
    return new Promise((resolve, reject) => {
        console.log(`Get channel ${channelId} content: fetching ${url}`);
        https.get(url, (res) => {
            let body = "";
            res.on("data", (chunk) => (body += chunk.toString()));
            res.on("error", reject);
            res.on("end", () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode <= 299) {
                    console.log(`Get channel ${channelId} content: content found`);
                    resolve(body);
                } else {
                    console.log(`Get channel ${channelId} content: content not found`);
                    reject("Request failed. status: " + res.statusCode + ", body: " + body);
                }
            });
        });
    });
}

export async function getCanalURL(timeout: number, channelId: string, options: {strategy: string, webpages: string[], target: string, blockedTypes: string[], blockedUrls: string[], }): Promise<string | undefined> {
    let finalUrl;

    // const proxyServer = process.env.PROXY || '181.39.76.247:999';
    // const proxyServer = '65.18.114.254:55443';
    
    for (let webpage of options.webpages) {
        const browser = await puppeteer.launch({
            headless: 'new',
            channel: 'chrome',
            args: [
                '--disable-notifications',
                "--disable-setuid-sandbox",
                "--no-sandbox",
                // "--single-process",
                "--no-zygote",
                "--disable-features=site-per-process",
                '--ignore-certificate-errors',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-infobars',
                '--window-size=1366,768',
                // `--proxy-server=${proxyServer}`
            ],
        });
    
        const page = await browser.newPage();
    
        try {

            // await page.setGeolocation({ latitude: -1.8312, longitude: -78.1834 });
            await page.setRequestInterception(true);
            page.on('request', async (request) => {
                if (options.blockedTypes.includes(request.resourceType()) || options.blockedUrls.some(e => request.url().includes(e))) {
                    request.abort();
                } else {
                    console.log(`Get channel ${channelId} url: Loading ${request.url()}`);
                    request.continue();
                }
            });
    
            page.on('error', async err => {
                if (!page.isClosed()) {
                    await page.close().catch(e => void e);
                }
                console.error(`Get channel ${channelId} url: Error found in page:${err}`);
            });
    
            page.setDefaultNavigationTimeout(timeout);
    
            console.log(`Get channel ${channelId} url: Start of page load ${webpage}`);
            page.goto(webpage).catch(error => {
                if (error.toString().includes("TimeoutError")) {
                    void error;
                } else {
                    console.error(`Get channel ${channelId} url: Error:${error.message}`);
                }
            });

            if (channelId === '010') {
                const response = await page.waitForResponse(response => {
                    return response.url().includes(options.target);
                }, { timeout: timeout });
        
                if (response) {
                    let r = await response.json();
                    // console.log("")
                    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
                    // console.log(r)
                    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
                    // console.log("")
                    finalUrl = r?.qualities?.auto[0]?.url;
                }
            } else {
                const request = await page.waitForRequest(request => {
                    return request.url().includes(options.target);
                }, { timeout: timeout });
        
                if (request) {
                    finalUrl = request.url();
                }
            }
    
        } catch (error: any) {
            if (error.message.includes("Navigating frame was detached")) {
                void error;
            } if (error.toString().includes("TimeoutError")) {
                console.log(`Get channel ${channelId} url: Timeout of ${timeout} ms exceeded`);
            } else {
                console.error(`Get channel ${channelId} url: Error: ${error.message}`);
            }
    
        } finally {
    
            if (!page.isClosed()) {
                await page.close().catch(e => void e);
            }
            await browser.close().catch(e => void e);
            console.log(`Get channel ${channelId} url: End of page load ${webpage}`);

            if (finalUrl) {
                break;
            }
    
        }
    }

    return finalUrl;
}
