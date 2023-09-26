import { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
// import https from 'https';
// import { pipeline } from 'stream';
import "dotenv/config";

export async function getCanal10(req: Request, res: Response) {

    let timeout = 30000;
    if (req.query.timeout) {
        let tempTimeout = Number(req.query.timeout);
        if (tempTimeout > 0) {
            timeout = tempTimeout;
        }
    }

    try {

        const filePath_canal8_link = path.join(__dirname, '..', '..', 'm3u-lists', 'canal-10.link');

        let link = await getCanal10URL(timeout);
        // if (!link) link = await getCanal10URL(timeout, true);

        if (link) {
            fs.writeFileSync(filePath_canal8_link, link);
            console.log("Generate m3u list: Channel 10 link found and written to storage: " + link);
        } else {
            console.log("Get channel 10: Link not found on internet, trying to get it from storage");
            if (fs.existsSync(filePath_canal8_link)) {
                fs.readFile(filePath_canal8_link, (err, data) => {
                    if (err) {
                        console.error("Get channel 10: Error reading storage:" + err);
                    } else {
                        link = data.toString();
                        console.log("Get channel 10: Link found: " + link);
                    }
                });
            } else {
                console.log("Get channel 10: Link not found on storage");
            }
        }

        if (link) {

            res.status(200).json(link);

            // https.get(link, (response) => {
            //     if (response.statusCode === 200) {
            //         res.setHeader('Content-Type', response.headers['Content-Type'] || 'application/x-mpegURL');
            //         pipeline(response, res, (err) => {
            //             if (err) {
            //                 console.error("Channel 10 service: Error redirecting response:", err);
            //             }
            //         });
            //     } else {
            //         res.status(500).json("Canal no disponible");
            //     }
            // });

        } else {
            res.status(404).json("Canal no disponible");
        }

    } catch (error) {
        console.error("Get channel 10:", error);
        res.status(500).json("Canal no disponible");
    }
}

export async function getCanal10URL(timeout = 30000): Promise<string | undefined> {
    let finalUrl;
    const urlToScrape = 'https://www.tctelevision.com/tc-en-vivo';
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
        ],
        // executablePath: puppeteer.executablePath('chrome')
        // executablePath: process.env.ENVIRONMENT !== "develop"
        //     ? process.env.PUPPETEER_EXECUTABLE_PATH
        //     : puppeteer.executablePath('chrome')
    });

    const page = await browser.newPage();

    try {

        const blockedTypes: string[] = [
            // "xhr",
            // "script",
            // "document",
            "image",
            "media",
            "font",
            "texttrack",
            "fetch",
            "prefetch",
            "eventsource",
            "websocket",
            "manifest",
            "signedexchange",
            "ping",
            "cspviolationreport",
            "preflight",
            "other",
            "stylesheet",
        ];

        const blockedUrls: string[] = [
            "https://code.jquery.com/",
            "https://securepubads.g.doubleclick.net/",
            "https://www.gstatic.com/",
            "https://cdnjs.cloudflare.com/",
            "https://www.googletagmanager.com/",
            "https://www.tctelevision.com/core/",
            "https://programacion.tctelevision.com/",
            "https://imasdk.googleapis.com/",
            "https://pebed.dm-event.net/",
            "https://vendorlist.dmcdn.net/",
            "https://speedtest.dailymotion.com/latencies.js",
            "https://dmxleo.dailymotion.com/",
            "https://static1.dmcdn.net/playerv5/dmp.controls_vod_secondary",
            "https://static1.dmcdn.net/playerv5/dmp.omid_session_client",
            "https://static1.dmcdn.net/playerv5/dmp.omweb",
            "https://static1.dmcdn.net/playerv5/dmp.locale",
            "https://static1.dmcdn.net/playerv5/dmp.advertising",
            "https://static1.dmcdn.net/playerv5/dmp.photon_player",
        ];

        await page.setRequestInterception(true);
        page.on('request', async (request) => {
            if (blockedTypes.includes(request.resourceType()) || blockedUrls.some(e => request.url().includes(e))) {
                request.abort();
            } else {
                console.log("Get channel 10 url: Loading " + request.url());
                request.continue();
            }
        });

        page.on('error', async err => {
            if (!page.isClosed()) {
                await page.close().catch(e => void e);
            }
            console.error("Get channel 10 url: Error found in page:" + err);
        });

        page.setDefaultNavigationTimeout(timeout);

        console.log("Get channel 10 url: Start of page load (" + urlToScrape + ")");
        page.goto(urlToScrape).catch(error => {
            throw error;
        });

        const request = await page.waitForRequest(request => {
            return request.url().includes('https://www.dailymotion.com/cdn/live/video/x7wijay.m3u8');
        }, { timeout: timeout });

        if (request) {
            finalUrl = request?.url();
        }

    } catch (error: any) {
        
        if (error.message.includes("Navigating frame was detached")) {
            void error;
        } if (error.title.includes("TimeoutError") || error.message.includes("TimeoutError")) {
            console.log("Get channel 10 url: Timeout of " + timeout + " ms exceeded");
        } else {
            console.error("Get channel 10 url: Error:", error.message);
        }

    } finally {

        if (!page.isClosed()) {
            await page.close().catch(e => void e);
        }
        await browser.close().catch(e => void e);
        console.log("Get channel 10 url: End of page load (" + urlToScrape + ")");

        return finalUrl;

    }
}
