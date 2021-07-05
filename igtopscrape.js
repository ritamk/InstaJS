import { Builder, By, Key, until } from "selenium-webdriver";
import { Options } from "selenium-webdriver/firefox.js";

let browser = new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(new Options().setProfile("./InstaJS"))
    .build();

let i, numAcc = 50;
let namearr = new Array(numAcc);

 /**
 * Attempts to make the processes stop for the duration of sleep (in seconds).
 * @param {number} ms Number of seconds to sleep.
 **/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
}

/**
 * Goes to the wikipedia page for top-followed Instagram accounts.
 **/
async function goToWiki() {
    await sleep(4);
    await browser.get("https://en.wikipedia.org/wiki/List_of_most-followed_Instagram_accounts");
}
/**
 * Returns elements of table sequentially.
 * @param {number} n Index number of the table element.
 **/
async function getHandle(n) {
    let name = await browser.wait(until.elementLocated(By.xpath(`//tr[${n}]/td/span/a`)), 5000);
    let handle = await name.getAttribute("innerHTML");
    return handle.toString();
}
/**
 * The main function that runs the whole operation
 * of creating the array with elements from the table.
 **/
async function run() {
    await goToWiki();
    for (i = 0; i < numAcc; i++) {
        namearr[i] += await getHandle(i + 1);
    }
    await sleep(4);
    // for (i = 0; i < numAcc; i++) {
        console.log(namearr);
    // }
}

run()