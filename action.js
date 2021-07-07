import { Builder, By, Key, until } from "selenium-webdriver";
import { Options } from "selenium-webdriver/firefox.js";
import { NoSuchElementError, ElementNotInteractableError } from "selenium-webdriver/lib/error.js";

const browser = new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(new Options().setProfile("./InstaJS"))
    .build();

 /**
 * Attempts to make the processes stop for the duration of sleep (in seconds).
 * @param {number} ms Number of seconds to sleep.
 **/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
}

/* Some functions  are seperated using two lines to indicate that those belong to
another class because I cannot process how to deal with classes yet. */

/* These functions help with the login process.
And rejecting/accepting the login info saving/notification prompts. */

 /**
 * Logs in with provided username, password.
 * @param {string} username Username of user.
 * @param {string} password Password of user.
 **/
async function loggingIn(username, password) {
    await sleep(5);
    await browser.wait(until.elementLocated(By.xpath("////input[@name = 'username']")), 10000);
    await browser.findElement(By.xpath("//input[@name = 'username']")).sendKeys(username);
    await browser.findElement(By.xpath("//input[@name = 'password']")).sendKeys(password, Key.ENTER);
    // await browser.findElement(By.xpath("//div[text() = 'Log In']")).click();
}
 /**
 * Selects "No" when prompted if the browser should remember the login details.
 * Ans also selects "No" when prompted if notifications are to be enabled.
 **/
async function sayNo() {
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//button[contains(.,'Save Info')]"), 5000).click());
    }
    catch (e) {
        console.error(e);
    }
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//button[contains(.,'Not Now')]")), 5000).click();
    }
    catch (e) {
        console.error(e);
    }
}
 /**
 * Selects "Yes" when prompted if the browser should remember the login details.
 * Ans selects "No" when prompted if notifications are to be enabled.
 **/
async function sayYes() {
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//button[contains(.,'Save Info')]"), 5000).click());
    }
    catch (e) {
        console.error(e);
    }
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//button[contains(.,'Not Now')]")), 5000).click();
    }
    catch (e) {
        console.error(e);
    }
}

/* These functions help with navigation in the website. */

 /**
 * Goes to home page.
 * Clicks the home icon on navbar.
 **/
async function home() {
    await sleep(1);
    try {
        await browser.wait(until.elementLocated(By.xpath("//*[name() = 'svg'][@aria-label = 'Home']")), 5000).click();
    }
    catch (e) {
        console.error(e);
    }
}
 /**
 * Goes to user's own profile page.
 * Clicks the profile picture on home page.
 **/
async function profile() {
    await sleep(1);
    try {
        await browser.wait(until.elementLocated(By.xpath("//section/div[3]/div/div/div/div[2]/div/div/div/a")), 5000).click();
    }
    catch (e) {
        console.error(e);
    }
}
 /**
 * Goes to profile page of specified user.
 * @param {string} name Username of the account to be reached.
 **/
async function user(name) {
    await sleep(1);
    await browser.get(`https://www.instagram.com/${name}/`);
}
 /**
 * Goes to the explore page.
 * CLicks on the explore icon on the navbar.
 **/
async function explore() {
    await sleep(1);
    try {
        await browser.wait(until.elementLocated(By.xpath("//*[name() = 'svg'][@aria-label = 'Find People']")), 5000).click();
    }
    catch (e) {
        console.error(e);
    }
}
 /**
 * Clicks on the activity feed icon to get rid of the annoying popups.
 **/
async function activity() {
    await browser.wait(until.elementLocated(By.xpath("//*[name() = 'svg'][@aria-label = 'Activity Feed']")), 5000).click();
    try {
        await home();
    }
    catch (e) {
        console.error("Couldn't click on activity feed icon: " + e);
    }
    await sleep(5);
}
 /**
 * Goes to the tag page of specified tag.
 * @param {string} hash The hashtag of the tag page to be reached.
 **/
async function tag(hash) {
    await sleep(1);
    await browser.get(`https://www.instagram.com/explore/tags/${hash}/`);
}
 /**
 * Goes to the "suggested people to follow" page.
 **/
async function suggested() {
    await sleep(1);
    await browser.get("https://www.instagram.com/explore/people/suggested/");
}
 /**
 * Goes to the "top profiles" directory.
 **/
async function topAcc() {
    await sleep(1);
    await browser.get("https://www.instagram.com/directory/profiles/0-0/");
}

/* These functions interact with the elements in the website
 after the user has logged in. */

 /**
 * Clicks the like icon in home page.
 * If it can't do that then it'll try scrolling a little to load
 * the element. If that doesn't help, it tries skipping past the task.
 * @param {number} n Number of posts to like in the home page.
 **/
async function homLike(n) {
    await home();
    for (let i = 0; i < n; i++) {
        await sleep(5);
        try {
            await browser.wait(until.elementLocated(By.xpath("//*[name() = 'svg'][@aria-label = 'Like'][@height = '24']")), 6000).click();
        }
        catch (e) {
            if (e instanceof NoSuchElementError) {
                try {
                    await sleep(2);
                    await scroll("two");
                    await sleep(2);
                    await browser.wait(until.elementLocated(By.xpath("//*[name() = 'svg'][@aria-label = 'Like'][@height = '24']")), 6000).click();
                }
                catch (e) {
                    console.error("Couldn't find like button in home page: " + e);
                }
            }
            else {
            }
        }
    }
}
 /**
 * Clicks the dislike icon in home page.
 * If it can't do that then it'll try scrolling a little to load
 * the element. If that doesn't help, it tries skipping past the task.
 * @param {number} n Number of posts to dislike in the home page.
 **/
async function homDislike(n) {
    await home();
    for (let i = 0; i < n; i++) {
        await sleep(5);
        try {
            await browser.wait(until.elementLocated(By.xpath("//*[name() = 'svg'][@aria-label = 'Unlike'][@height = '24']")), 6000).click();
        }
        catch (e) {
            if (e instanceof NoSuchElementError) {
                try {
                    await sleep(2);
                    await scroll("two");
                    await sleep(2);
                    await browser.wait(until.elementLocated(By.xpath("//*[name() = 'svg'][@aria-label = 'Unlike'][@height = '24']")), 6000).click();
                }
                catch (e) {
                    console.error("Couldn't find dislike button in home page: " + e);
                }
            }
            else {
            }
        }
    }
}
 /**
 * Clicks the like button in posts.
 * If it fails to do that, then it tries skipping past the task.
 **/
async function postLike() {
    await sleep(1);
    try {
        await browser.wait(until.elementLocated(By.xpath("//*[name() = 'svg'][@aria-label = 'Like'][@height = '24']")), 8000).click();
    }
    catch (e) {
        console.error("Couldn't like selected post: " + e);
    }
}
 /**
 * Clicks the dislike button in posts.
 * If it fails to do that, then it tries skipping past the task.
 **/
async function postDislike() {
    await sleep(1);
    try {
        await browser.wait(until.elementLocated(By.xpath("//*[name() = 'svg'][@aria-label = 'Unlike'][@height = '24']")), 8000).click();
    }
    catch (e) {
        console.error("Couldn't dislike selected post: " + e);
    }
}
 /**
 * Comments on posts.
 * If it can't do that, it tries skipping past the task.
 * @param {string} text The text that is to be commented.
 **/
async function comment(text) {
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//section[3]/div/form/textarea")), 8000).click();
        await browser.wait(until.elementLocated(By.xpath("//section[3]/div/form/textarea")), 2000).sendKeys(text, Key.ENTER);
    }
    catch (e) {
        if (e instanceof NoSuchElementError) {
            console.error("Couldn't locate post comment area.");
        }
        else if (e instanceof ElementNotInteractableError) {
            try {
                await scroll("top");
                await sleep(1);
                await browser.wait(until.elementLocated(By.xpath("//section[3]/div/form/textarea")), 8000).click();
                await sleep(2);
                await browser.wait(until.elementLocated(By.xpath("//section[3]/div/form/textarea")), 2000).sendKeys(text, Key.ENTER);
                console.error("Post comment area wasn't interactable, but commented.");
            }
            catch {
                console.error("Post comment area wasn't interactable.");
    
            }
        }
        else {
            console.error("Couldn't comment: " + e);

        }
    }
}
 /**
 * Clicks the first picture in a profile page.
 * If there are no posts in the profile, it returns 0.
 * If it can't do that, it tries skipping past the task.
 **/
async function postSelect() {
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//article/div/div/div/div")), 10000).click();
    }
    catch (e) {
        console.error("Couldn't select post in the profile page: " + e);
    }
}
 /**
 * Clicks the first picture in the explore page.
 * If it can't do that, it tries skipping past the task.
 **/
async function expSelect() {
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//main/div/div/div/div/div[2]")), 6000).click();
    }
    catch (e) {
        console.error("Couldn't select first post in the explore page: " + e);
    }
}
 /**
 * Clicks the first top post of a tag.
 * If it can't do that, it tries skipping past the task.
 **/
async function topSelect() {
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//article/div/div/div/div/div")), 6000).click();
    }
    catch (e) {
        console.error("Couldn't select the top post in the tag page: " + e);
    }
}
 /**
 * Clicks the first recent post of a tag.
 * If it can't do that, it tries skipping past the task.
 **/
async function recSelect() {
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//article/div[2]/div/div/div")), 6000).click();
    }
    catch (e) {
        console.error("Couldn't select recent post in tag page: " + e);
    }
}
 /**
 * Clicks the next button on a post in a profile.
 * If it can't do that, it tries skipping past the task.
 **/
async function next() {
    try {
        await browser.wait(until.elementLocated(By.xpath("//a[contains(.,'Next')]")), 1000).click();
    }
    catch (e) {
        close();
        console.error("Couldn't locate the next button: " + e);
    }
}
 /**
 * Clicks the previous button on a post in a profile.
 * If it can't do that, it tries skipping past the task.
 **/
async function prev() {
    try {
        await browser.wait(until.elementLocated(By.xpath("//a[contains(.,'Previous')]")), 1000).click();
    }
    catch (e) {
        close();
        console.error("Couldn't locate the previous button: " + e);
    }
}
 /**
 * Clicks the close button on a post in a profile.
 * If it can't do that, it tries skipping past the task and goes to the home page.
 **/
async function close() {
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//*[name() = 'svg'][@aria-label = 'Close']")), 3000).click();
    }
    catch (e) {
        console.error("Couldn't locate the close button: " + e);
    }
}
 /**
 * Scrolls to the top if specified, otherwise goes 500px downwards.
 * Also it can go to the emoji in a home page post, if specified.
 * @param {string} dir "top" goes to top of the page,
 * "emoji" goes to the emoji icon in a post in the home page. 
 **/
async function scroll(dir) {
    await sleep(1);
    if (dir == "top") {
        await browser.executeScript("window.scrollTo(0, 0);");
    }
    else if (dir = "emoji") {
        try {
            let emo = await browser.wait(until.elementLocated(By.xpath("//*[name() = 'svg'][@aria-label = 'Emoji']")), 4000);
            await browser.executeScript("arguments[0].scrollIntoView(true);", emo);
        }
        catch {
        }
    }
    else {
        await browser.executeScript("window.scrollTo(0, 500);");
    }
}
 /**
 * Returns number of posts of user.
 * If it can't do that, it returns 0.
 **/
async function postCount() {
    await sleep(1);
    // try {
        let posts = await browser.wait(until.elementLocated(By.xpath("//li/span/span")), 2000)
        let count = await posts.getAttribute("innerHTML");
        return Number(count);
    // }
    // catch (e) {
    //     console.error("Couldn't find the post count: " + e);
    //     return 0;
    // }
}
 /**
 * Clicks the follow button in any user's page.
 * If it can't do that, it tries skipping past the task.
 **/
async function follow() {
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//button[contains(.,'Follow')]")), 5000).click();
    }
    catch (e) {
        console.error("Couldn't find follow button: " + e);
    }
}
 /**
 * Clicks the unfollow button in unfollow prompt.
 * If it can't do that, it tries skipping past the task.
 **/
async function unfollow() {
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//button[contains(.,'Unfollow')]")), 5000).click();
    }
    catch {
        try {
            await browser.wait(until.elementLocated(By.xpath("//button[contains(.,'Requested')]")), 5000).click();
            await browser.wait(until.elementLocated(By.xpath("//button[contains(.,'Unfollow')]")), 4000).click();
        }
        catch (e) {
            console.error("Couldn't find unfollow button: " + e);

        }
    }
}
 /**
 * Clicks the follow button in suggestion page if parameter is 'fol' ,otherwise it goes into their profiles.
 * @param {string} n "fol" clicks the follow button in the suggestions page.
 * Otherwise it just goes into the profiles.
 **/
async function sugFollow(n) {
    if (n == "fol") {
        try {
            await sleep(2);
            await browser.wait(until.elementLocated(By.xpath("//button[contains(.,'Follow')]")), 4000).click();
        }
        catch (e) {
            console.error("Couldn't find follow button in suggestions page: " + e);

        }
    }
    else {
        try {
            await sleep(1);
            await browser.wait(until.elementLocated(By.xpath(`div[${n}]/div[2]/div/div/span/a`)), 4000).click();
        }
        catch (e) {
            console.error("Couldn't go to profile from suggestions page: " + e);
        }
    }
}
 /**
 * Checks if there's a "Account is private" tag.
 * If it's a private account, it returns 0, otherwise 1.
 **/
async function pvtAcc() {
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//h2[contains(.,'Private')]")), 1000);
        return 0;
    }
    catch {
        return 1;
    }
}
 /**
 * Returns number of accounts the user follows.
 * If it can't do that, it returns 0.
 **/
async function followingCount() {
    await sleep(2);
    try {
        let following = await browser.wait(until.elementLocated(By.xpath("//li[3]/a/span")), 5000);
        let count = await following.getAttribute("innerHTML");
        return Number(count);
    }
    catch (e) {
        console.error("Couldn't find following count: " + e);
        return 0;
    }
}
 /**
 * Returns number of accounts that follow the user.
 * If it can't do that, it returns 0.
 **/
async function followerCount() {
    await sleep(2);
    try {
        let follower = await browser.wait(until.elementLocated(By.xpath("//li[2]/a/span")), 5000);
        let count = await follower.getAttribute("innerHTML");
        return Number(count);
    }
    catch (e) {
        console.error("Couldn't find follower count: " + e);
        return 0;
    }
}
 /**
 * Clicks at the follower(s) button in a profile.
 **/
async function profFollower() {
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//a[contains(.,'follower')]"))).click();
    }
    catch (e) {
        console.error("Couldn't find the follower(s) button in profile: " + e);
    }
}
 /**
 * Goes to a profile from the follower/following menu sequentially.
 * @param {number} n Index number of the account that is to be opened.
 **/
async function followerToProf(n) {
    await sleep(1);
    try {
        await browser.wait(until.elementLocated(By.xpath(`//li[${n}]/div/div[2]/div/div/div/span`)), 4000).click();
    }
    catch (e) {
        console.error("Couldn't find profile in follower menu: " + e);
    }
}
 /**
 * Clicks the following button in profile.
 * If it can't do that, it tries skipping past the task.
 **/
async function profFollowing() {
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//a[contains(.,'following')]")), 5000).click();
    }
    catch (e) {
        console.error("Couldn't find the following button in own profile: " + e);
    }
}
 /**
 * Clicks the unfollow button in user's following pop-up menu.
 * If it can't do that, it tries skipping past the task.
 * @param {number} n Index number of the follow button.
 **/
async function profUnfollow(n) {
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath(`//li[${n}]/div/div[3]`)), 2000).click();
    }
    catch {
        try {
            await scroll("two");
            await browser.wait(until.elementLocated(By.xpath(`//li[${n}]/div/div[3]`)), 5000).click();
        }
        catch (e) {
            console.error("Couldn't find the following button in profile: " + e);
        }
    }
    await sleep(1);
    try {
        await browser.wait(until.elementLocated(By.xpath("//button[text() = 'Unfollow']")), 2000).click();
    }
    catch (e) {
        console.error("Couldn't find the unfollow button in profile: " + e);
    }
}
 /**
 * Clicks the username of the post uploader when post is selected.
 * If it can't do that, it tries skipping past the task.
 **/
async function postToProf() {
    await sleep(1);
    try {
        await browser.wait(until.elementLocated(By.xpath("//a/img")), 5000).click();
    }
    catch (e) {
        console.error("Couldn't go from post to profile: " + e);
    }
}
 /**
 * Switches between multiple accounts from home page.
 * If it can't do that, it goes back to the home page of current user.
 **/
async function switchAcc() {
    await sleep(1);
    await browser.wait(until.elementLocated(By.xpath("//button[contains(.,'Switch')]")), 2000).click();
    await sleep(3);
    try {
        await browser.wait(until.elementLocated(By.xpath("//div[2]/div[2]/div/div/a/img")), 6000).click();
    }
    catch (e) {
        await home();
        console.error("Couldn't switch accounts: " + e);
    }
}
 /**
 * Clicks the top profiles sequentially.
 * If it can't do that, it tries skipping past the task.
 **/
async function topAccounts(n) {
    await sleep(1);
    try {
        await browser.wait(until.elementLocated(By.xpath(`//li[${num}]/a`)), 5000).click();
    }
    catch (e) {
        console.error("Couldn't find account in top accounts page: " + e);
    }
}

/* Here is the command to export the functions in the imaginary "do" class. */
export { browser, loggingIn, sayNo, sayYes, home, profile, user, explore, activity, tag, suggested, topAcc,
            homLike, homDislike, postLike, postDislike, comment, postSelect, expSelect,
            topSelect, recSelect, next, prev, close, scroll, postCount, follow, unfollow,
            sugFollow, pvtAcc, followingCount, followerCount, profFollower, followerToProf,
            profFollowing, profUnfollow, postToProf, switchAcc, topAccounts };
