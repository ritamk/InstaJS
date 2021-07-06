import * as I from "./index.js";

/* List of top instagram accouts obtained via "./igtopscrape.js" scraping wiki. */
let top = ["instagram", "cristiano", "therock", "arianagrande", "kyliejenner", "selenagomez", "kimkardashian", "leomessi", "beyonce", "justinbieber",
            "kendalljenner", "natgeo", "taylorswift", "jlo", "khloekardashian", "nike", "neymarjr", "nickiminaj", "mileycyrus", "virat.kohli",
            "kourtneykardash", "katyperry", "kevinhart4real", "ddlovato", "theellenshow", "realmadrid", "badgalriri", "zendaya", "iamcardib", "fcbarcelona",
            "kingjames", "billieeilish", "chrisbrownofficial", "champagnepapi", "championsleague", "vindiesel", "shakira", "victoriassecret", "dualipa", "gigihadid",
            "nasa", "davidbeckham", "priyankachopra", "shraddhakapoor", "snoopdogg", "shawnmendes", "justintimberlake", "emmawatson", "nehakakkar", "maluma"]

/* List of comments. */
let com = ["Nice", "Lovely", "Great"];

/* Sequentially add functions inside this function that takes orders and executes them. */
async function doThis() {
    await I.startIG();
    // await I.login("ritksth", "#");
    // await I.sayNo();
    await I.ownUnfollow(4);
    // await I.stopIG(5);
}

doThis();
