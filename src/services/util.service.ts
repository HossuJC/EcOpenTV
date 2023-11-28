import { generateCanalesInterno, generateList } from "./lista.services";
import path from 'path';
import fs from 'fs';

export function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function firstScrape() {
    console.log("First list generation running");
    await generateCanalesInterno(120000);
    generateList();
    console.log("First list generation finished");
}

export async function startContinuosScrape() {
    let interval: number;
    while (true) {
        interval = randomIntFromInterval(1000 * 60 * 40, 1000 * 60 * 60);
        console.log("Automated list generation running");
        await generateCanalesInterno(120000);
        generateList();
        console.log(
            "Automated list generation finished, next run at: " +
            new Date(Date.now() + interval)
        );
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
}

export async function checkLastRunAndScrape() {
    let lastRunPath: string = path.join(__dirname, '..', 'resources', "lastRun.txt");
    console.log("Checking time of last run");
    if (fs.existsSync(lastRunPath)) {
        let lastRun = fs.readFileSync(lastRunPath, 'utf8');
        let remainingTime = Number(lastRun) + (1000 * 60 * 100) - Date.now();
        if (remainingTime <= 0) {
            console.log("Time from last run: " + (remainingTime / 1000 / 60 * (-1)) + " minutes");
            console.log("Trigered list generation running");
            await generateCanalesInterno(120000);
            generateList();
            console.log("Trigered list generation finished");
        } else {
            console.log("Remaining time until next possible run: " + (remainingTime / 1000 / 60) + " minutes")
        }
    } else {
        console.log("Time of last run not found");
        console.log("Trigered list generation running");
        await generateCanalesInterno(120000);
        generateList();
        console.log("Trigered list generation finished");
    }
}
