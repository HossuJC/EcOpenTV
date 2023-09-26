import https from "https";
import { generateM3UListEc } from "./lista.services";

export function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function startContinuosScrape() {
    let interval: number;
    while (true) {
        interval = randomIntFromInterval(1000 * 60 * 40, 1000 * 60 * 60);
        console.log("Automated list generation running");
        await generateM3UListEc(120000);
        console.log(
            "Automated list generation finished, next run at: " +
            new Date(Date.now() + interval)
        );
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
}

export async function getCanalContent(m3u_link: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(m3u_link, (res) => {
            let body = "";
            res.on("data", (chunk) => (body += chunk.toString()));
            res.on("error", reject);
            res.on("end", () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode <= 299) {
                    resolve(body);
                } else {
                    reject("Request failed. status: " + res.statusCode + ", body: " + body);
                }
            });
        });
    });
}
