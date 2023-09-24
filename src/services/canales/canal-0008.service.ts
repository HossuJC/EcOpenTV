import { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import https from 'https';
import { pipeline } from 'stream';

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
        console.log(new Date() + " " + "Channel 8 service: url found: " + link);

        if (link) {

            https.get(link, (response) => {
                if (response.statusCode === 200) {
                    res.setHeader('Content-Type', response.headers['Content-Type'] || 'application/x-mpegURL');
                    pipeline(response, res, (err) => {
                        if (err) {
                            console.error(new Date() + " " + "Channel 8 service: Error redirecting response:", err);
                        }
                    });
                } else {
                    res.status(500).json("Canal no disponible");
                }
            });

        } else {
            throw new Error("No URL available");
        }

    } catch (error) {
        console.error(new Date() + " " + "Channel 8 service:", error);
        res.status(500).json("Canal no disponible");
    }
}

export async function getCanal8URL(timeout = 30000): Promise<string | undefined> {
    let finalUrl;
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--disable-notifications',
            "--disable-setuid-sandbox",
            "--no-sandbox",
            // "--single-process",
            "--no-zygote",
        ],
        executablePath: process.env.ENVIRONMENT === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath('chrome')
    });
    console.log(process.env.ENVIRONMENT === "production" + " " + process.env.PUPPETEER_EXECUTABLE_PATH );
    const page = (await browser.pages())[0];

    try {

        let allowedTypes: string [] = [
            "xhr",
            "script",
            "document",
            "prefetch",
            "stylesheet",
            // "image",
            // "media",
            // "font",
            // "texttrack",
            // "fetch",
            // "eventsource",
            // "websocket",
            // "manifest",
            // "signedexchange",
            // "ping",
            // "cspviolationreport",
            // "preflight",
            // "other",
        ];

        await page.setRequestInterception(true);
        page.on('request', async (request) => {
            if (allowedTypes.includes(request.resourceType())) {
                console.log(request.url());
                request.continue();
            } else {
                request.abort();
            }
        });

        console.log(new Date() + " " + "Get channel 8: start of page load");
        page.setDefaultNavigationTimeout(0);
        page.goto('https://www.gamavision.com.ec/').catch(error => {
            if (error.message === "Navigating frame was detached") {
                void error;
            } else {
                console.error(new Date() + " " + "Get channel 8: Error loading page:", error);
            }
        });
        const response = await page.waitForResponse(response => {
            return response.url().includes('https://live-api.vimeocdn.com/') && response.ok();
        }, {timeout: timeout});

        if (response) {
            finalUrl = (await response.json()).url;
        }

    } catch (error) {

        console.error(new Date() + " " + "Get channel 8: Error at looking for an specific request:", error);

    } finally {

        await page.close().catch(e => void e);
        await browser.close().catch(e => void e);
        console.log(new Date() + " " + "Get channel 8: end of page load");

        return finalUrl;

    }
}
