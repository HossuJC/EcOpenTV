import { Response } from 'express';
import puppeteer from 'puppeteer';
import https from 'https';
import { pipeline } from 'stream';

export async function getCanal8(res: Response) {
    try {

        let link: string | undefined = await getCanal8URL();
        console.log(new Date() + " " + "Channel 8 service: url found: " + link)

        if (link) {

            https.get(link, (response) => {
                if (response.statusCode === 200) {
                    Object.keys(response.headers).map((e) => {
                        res.setHeader(e, response.headers[e] as string)
                    });
                    pipeline(response, res, (err) => {
                        if (err) {
                            console.error(new Date() + " " + "Channel 8 service:", err);
                            res.status(500).json("Canal no disponible");
                        }
                    });
                } else {
                    res.status(500).json("Canal no disponible");
                }
            });

        } else {
            console.error(new Date() + " " + "Channel 8 service: No URL available");
            res.status(500).json("Canal no disponible");
        }

    } catch (error) {
        console.error(new Date() + " " + "Channel 8 service:", error);
        res.status(500).json("Canal no disponible");
    }
}

export async function getCanal8URL(timeout = 15000): Promise<string | undefined> {
    let finalUrl;
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    let pagePromise;

    try {

        console.log(new Date() + " " + "Get channel 8: start of page load")
        pagePromise = page.goto('https://www.gamavision.com.ec/').catch(error => {
            console.error(new Date() + " " + "Get channel 8: Error loading page:", error)
        });
        const response = await page.waitForResponse(response => {
            return response.url().includes('https://live-api.vimeocdn.com/') && response.ok()
        }, {timeout: timeout});

        if (response) {
            finalUrl = (await response.json()).url;
        }

    } catch (error) {

        console.error(new Date() + " " + "Get channel 8: Error at looking for an specific request:", error);

    } finally {

        pagePromise?.then(async () => {
            console.log(new Date() + " " + "Get channel 8: end of page load");
            await page.close();
            await browser.close();
        }).catch(error => {
            console.error(new Date() + " " + "Get channel 8: Error at closing page or browser:", error)
        })
        return finalUrl;

    }
}
