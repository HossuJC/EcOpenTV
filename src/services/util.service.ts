import { generateCanalesInterno, generateList } from "./lista.services";

export function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
