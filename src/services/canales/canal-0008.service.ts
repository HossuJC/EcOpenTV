import { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
// import https from 'https';
// import { pipeline } from 'stream';
import "dotenv/config";

export async function getCanal8(req: Request, res: Response) {

    let timeout = 30000;
    if (req.query.timeout) {
        let tempTimeout = Number(req.query.timeout);
        if (tempTimeout > 0) {
            timeout = tempTimeout;
        }
    }

    try {

        const filePath_canal8_link = path.join(__dirname, '..', '..', 'm3u-lists', 'canal-8.link');

        let link = await getCanal8URL(timeout);
        if (!link) link = await getCanal8URL(timeout, true);

        if (link) {
            fs.writeFileSync(filePath_canal8_link, link);
            console.log("Generate m3u list: Channel 8 link found and written to storage: " + link);
        } else {
            console.log("Get channel 8: Link not found on internet, trying to get it from storage");
            if (fs.existsSync(filePath_canal8_link)) {
                fs.readFile(filePath_canal8_link, (err, data) => {
                    if (err) {
                        console.error("Get channel 8: Error reading storage:" + err);
                    } else {
                        link = data.toString();
                        console.log("Get channel 8: Link found: " + link);
                    }
                });
            } else {
                console.log("Get channel 8: Link not found on storage");
            }
        }

        if (link) {

            res.status(200).json(link);

            // https.get(link, (response) => {
            //     if (response.statusCode === 200) {
            //         res.setHeader('Content-Type', response.headers['Content-Type'] || 'application/x-mpegURL');
            //         pipeline(response, res, (err) => {
            //             if (err) {
            //                 console.error("Channel 8 service: Error redirecting response:", err);
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
        console.error("Get channel 8:", error);
        res.status(500).json("Canal no disponible");
    }
}

export async function getCanal8URL(timeout = 30000, alter = false): Promise<string | undefined> {
    let finalUrl;
    const urlToScrape = !alter ? 'https://www.gamavision.com.ec/' : 'https://vimeo.com/event/3564149/embed';
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
            // "prefetch",
            // "stylesheet",
            "image",
            "media",
            "font",
            "texttrack",
            "fetch",
            "eventsource",
            "websocket",
            "manifest",
            "signedexchange",
            "ping",
            "cspviolationreport",
            "preflight",
            "other",
        ];

        const blockedUrls: string[] = [
            "https://www.gamavision.com.ec/wp-",
            "https://www.google-analytics.com/",
            "https://connect.facebook.net/",
            "https://static.addtoany.com/",
            "https://bam.nr-data.net/",
            "https://www.gstatic.com/",
            "https://www.googletagmanager.com/",
            "https://fonts.googleapis.com/",
            "https://tracker.metricool.com/",
            "https://js-agent.newrelic.com/",
            "https://cdn.jsdelivr.net/",
            "https://player.vimeo.com/static/proxy.html",
            "https://f.vimeocdn.com/js_opt/app/embed/_next/static/s",
            "https://f.vimeocdn.com/js_opt/app/embed/_next/static/css/",




        ];

        await page.setRequestInterception(true);
        page.on('request', async (request) => {
            if (blockedTypes.includes(request.resourceType()) || blockedUrls.some(e => request.url().includes(e))) {
                request.abort();
            } else {
                console.log("Get channel 8 url: Loading " + request.url());
                request.continue();
            }
        });

        page.on('error', async err => {
            if (!page.isClosed()) {
                await page.close().catch(e => void e);
            }
            console.error("Get channel 8 url: Error found in page:" + err);
        });

        page.setDefaultNavigationTimeout(timeout);

        console.log("Get channel 8 url: Start of page load (" + urlToScrape + ")");
        page.goto(urlToScrape).catch(error => {
            throw error;
        });

        const request = await page.waitForRequest(request => {
            return request.url().includes('https://live-ak.vimeocdn.com/');
        }, { timeout: timeout });

        if (request) {
            finalUrl = request?.url();
        }

    } catch (error: any) {
        
        if (error.message.includes("Navigating frame was detached")) {
            void error;
        } if (error.title.includes("TimeoutError") || error.message.includes("TimeoutError")) {
            console.log("Get channel 8 url: Timeout of " + timeout + " ms exceeded");
        } else {
            console.error("Get channel 8 url: Error:", error.message);
        }

    } finally {

        if (!page.isClosed()) {
            await page.close().catch(e => void e);
        }
        await browser.close().catch(e => void e);
        console.log("Get channel 8 url: End of page load (" + urlToScrape + ")");

        return finalUrl;

    }
}
