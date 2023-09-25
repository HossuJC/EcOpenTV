import { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import https from 'https';
import { pipeline } from 'stream';
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

        let link: string | undefined = await getCanal8URL(timeout);
        console.log("Channel 8 service: url found: " + link);

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
            throw new Error("No URL available");
        }

    } catch (error) {
        console.error("Channel 8 service:", error);
        res.status(500).json("Canal no disponible");
    }
}

export async function getCanal8URL(timeout = 30000): Promise<string | undefined> {
    let finalUrl;
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
    
    let page = await browser.newPage();

    try {

        const blockedTypes: string [] = [
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

        const blockedUrls: string [] = [
            // "https://f.vimeocdn.com/",
            "https://www.gamavision.com.ec/wp-",
            "https://www.google-analytics.com/",
            "https://connect.facebook.net/",
            "https://static.addtoany.com/",
            "https://www.gamavision.com.ec/wp-content/themes/",
            "https://bam.nr-data.net/",
            "https://www.gstatic.com/",
            "https://www.googletagmanager.com/",
            "https://fonts.googleapis.com/",
            "https://tracker.metricool.com/",
            "https://js-agent.newrelic.com/",
            "https://cdn.jsdelivr.net/",

        ]

        await page.setRequestInterception(true);
        page.on('request', async (request) => {
            if (blockedTypes.includes(request.resourceType()) || blockedUrls.some(e => request.url().includes(e))) {
                request.abort();
            } else {
                console.log(request.url());
                request.continue();
            }
        });

        page.on('error', async err => {
            if (!page.isClosed()) {
                await page.close().catch(e => void e);
            }
            console.log("")
            console.log("===================================================")
            console.error(err)
            console.log("===================================================")
            console.log("")
        });

        console.log("Get channel 8: start of page load");
        page.setDefaultNavigationTimeout(timeout);

        page.goto('https://www.gamavision.com.ec/').catch(error => {
            if (error.message === "Navigating frame was detached") {
                void error;
            } else {
                console.error("Get channel 8: Error loading page:", error);
            }
        });

        const request = await page.waitForRequest(request => {
            return request.url().includes('https://vimeo.com/event/');
        }, {timeout: timeout});

        if (request) {
            finalUrl = request?.url();
        }

        // const request = await page.waitForRequest(request => {
        //     return request.url().includes('https://live-ak.vimeocdn.com/');
        // }, {timeout: timeout});

        // if (request) {
        //     finalUrl = request?.url();
        // }

    } catch (error) {

        console.error("Get channel 8: Error at looking for an specific request:", error);

    } finally {

        if (!page.isClosed()) {
        await page.close().catch(e => void e);
        }
        await browser.close().catch(e => console.error(e));
        console.log("Get channel 8: end of page load");

        return finalUrl ? getCanal8URL_M3U(finalUrl, timeout) : undefined;

    }
}

export async function getCanal8URL_M3U(videoUrl, timeout = 30000): Promise<string | undefined> {
    let finalUrl;
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
    
    let page = await browser.newPage();

    try {

        const blockedTypes: string [] = [
            // "xhr",
            // "script",
            // "document",
            // "prefetch",
            "stylesheet",
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

        const blockedUrls: string [] = [
            // "https://f.vimeocdn.com/",
            "https://www.gamavision.com.ec/wp-",
            "https://www.google-analytics.com/",
            "https://connect.facebook.net/",
            "https://static.addtoany.com/",
            "https://www.gamavision.com.ec/wp-content/themes/",
            "https://bam.nr-data.net/",
            "https://www.gstatic.com/",
            "https://www.googletagmanager.com/",
            "https://fonts.googleapis.com/",
            "https://tracker.metricool.com/",
            "https://js-agent.newrelic.com/",
            "https://cdn.jsdelivr.net/",

        ]

        await page.setRequestInterception(true);
        page.on('request', async (request) => {
            if (blockedTypes.includes(request.resourceType()) || blockedUrls.some(e => request.url().includes(e))) {
                request.abort();
            } else {
                console.log(request.url());
                request.continue();
            }
        });

        page.on('error', async err => {
            if (!page.isClosed()) {
                await page.close().catch(e => void e);
            }
            console.log("")
            console.log("===================================================")
            console.error(err)
            console.log("===================================================")
            console.log("")
        });

        console.log("Get channel 8: start of page load");
        page.setDefaultNavigationTimeout(timeout);

        page.goto(videoUrl).catch(error => {
            if (error.message === "Navigating frame was detached") {
                void error;
            } else {
                console.error("Get channel 8: Error loading page:", error);
            }
        });

        const request = await page.waitForRequest(request => {
            return request.url().includes('https://live-ak.vimeocdn.com/');
        }, {timeout: timeout});

        if (request) {
            finalUrl = request?.url();
        }

    } catch (error) {

        console.error("Get channel 8: Error at looking for an specific request:", error);

    } finally {

        if (!page.isClosed()) {
        await page.close().catch(e => void e);
        }
        await browser.close().catch(e => console.error(e));
        console.log("Get channel 8: end of page load");

        return finalUrl;

    }
}
