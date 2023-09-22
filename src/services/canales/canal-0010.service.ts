import { Response } from 'express';
import puppeteer from 'puppeteer';
import https from 'https';
import { pipeline } from 'stream';

export async function getCanal10(res: Response) {
    try {

        let link: string | undefined = await getCanal10URL();
        console.log(new Date() + " " + "Channel 10 service: url found: " + link)

        if (link) {

            https.get(link, (response) => {
                if (response.statusCode === 200) {
                    Object.keys(response.headers).map((e) => {
                        res.setHeader(e, response.headers[e] as string)
                    });
                    pipeline(response, res, (err) => {
                        if (err) {
                            console.error(new Date() + " " + "Channel 10 service:", err);
                            res.status(500).json("Canal no disponible");
                        }
                    });
                } else {
                    res.status(500).json("Canal no disponible");
                }
            });

        } else {
            console.error(new Date() + " " + "Channel 10 service: No URL available");
            res.status(500).json("Canal no disponible");
        }

    } catch (error) {
        console.error(new Date() + " " + "Channel 10 service:", error);
        res.status(500).json("Canal no disponible");
    }
}

export async function getCanal10URL(timeout = 15000): Promise<string | undefined> {
    let finalUrl;
    const browser = await puppeteer.launch({ headless: 'new', channel: 'chrome', args: ['--disable-notifications'] });
    const page = await browser.newPage();
    let pagePromise;

    try {

        console.log(new Date() + " " + "Get channel 10: start of page load")
        pagePromise = page.goto('https://www.tctelevision.com/tc-en-vivo').catch(error => {
            console.error(new Date() + " " + "Get channel 10: Error loading page:", error)
        });
        const response = await page.waitForResponse(response => {
            return response.url().includes('https://www.dailymotion.com/cdn/live/video/x7wijay.m3u8') && response.ok()
        }, {timeout: timeout});

        if (response) {
            finalUrl = response.url();
        }

    } catch (error) {

        console.error(new Date() + " " + "Get channel 10: Error at looking for an specific request:", error);

    } finally {

        pagePromise?.then(async () => {
            console.log(new Date() + " " + "Get channel 10: end of page load");
            await page.close();
            await browser.close();
        }).catch(error => {
            console.error(new Date() + " " + "Get channel 10: Error at closing page or browser:", error)
        })
        return finalUrl;

    }
}
