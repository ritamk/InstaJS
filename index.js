import { Builder, By, Key, until } from "selenium-webdriver";
import { Options } from "selenium-webdriver/firefox.js";
import { NoSuchElementError, ElementNotInteractableError } from "selenium-webdriver/lib/error.js";

let browser = new Builder()
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

 /**
 * Returns a random index from an array.
 * @param {Array<string>} items Array of strings.
 **/
function rand(items) {
    // "|" for a kinda "int div"
    return items[items.length * Math.random() | 0];
}

/* Some functions  are seperated using two lines to indicate that those belong to
another class because I cannot process how to deal with classes yet. */

 /**
 * Goes to instagram website.
 **/
async function startIG() {
    await browser.get("https://www.instagram.com/");
}
 /**
 * Logs into instagram.
 * @param {string} username Username of the account.
 * @param {string} password Password of the account.
 **/
async function login(username, password) {
    await loggingIn(username, password);
    /* if login details are to be saved, use sayYes()
    and comment out sayNo(). */
    // await sayYes();
    await sayNo();
    await home();
}
 /**
 * Quits the browser after waiting a while.
 * @param {number} wait Period for which the script stays
 * active before quitting the session.
 **/
async function stopIG(wait) {
    await sleep(wait);
    await browser.close();
}
 /**
 * Likes posts in home page.
 * @param {number} num Number of posts to like.
 **/
async function likeHome(num) {
    await homLike(num);
    await scroll("top");
}
 /**
 * Dislikes posts in home page.
 * @param {number} num Number of posts to dislike.
 **/
async function dislikeHome(num) {
    await homDislike(num);
    await scroll("top");
}
 /**
 * Follows suggested accounts.
 * @param {number} numProf Number of profiles to follow
 * in the suggestions page.
 **/
async function suggestedFollow(numProf) {
    for (let i = 0; i < numProf; i++) {
        await suggested();
        /* if going into the profiles each time is not required,
        then just loop the line below and comment out the rest up till home(). */
        // sugFollow("fol");
        await sugFollow(i + 1);
        if (await pvtAcc() == 0) {
            await follow();
            await sleep(120);
            await browser.navigate().refresh();
            await sleep(1);
            if (await pvtAcc() == 1) {
                await postSelect();
                await postLike();
                await close();
            }
            else {
                await unfollow();
            }
        }
        else {
            await postSelect();
            await postLike();
            await close();
        }
        await suggested();
    }
    await home();
}
 /**
 * Follows and likes a post of specified profile.
 * @param {string} handle Username of the account that is to be visited.
 **/
async function profFollow(handle) {
    await user(handle);
    /* use this when liking all pictures in the account. */
    // let n = await postCount();
    if (await pvtAcc() == 0) {
        await follow();
        await sleep(120);
        await browser.navigate().refresh();
        if (await pvtAcc() == 1) {
            await postSelect();
            await postLike();
            await close();
        }
        else {
            await unfollow();
        }
    }
    else {
        await follow();
        await postSelect();
        /* to like all pictures in account, run through the for loop
        or else comment out the for loop and just like one post. */
        await postLike();
        // for (i = 0; i < n; i++) {
        //     await postLike();
        //     await next();
        // }
        await close();
    }
    await home();
}
 /**
 * Goes to specified account and interacts with the followers of that account.
 * @param {number} num Number of posts that are to interacted with.
 * @param {number} numProf Number of profiles that are to be interacted with.
 * @param {Array<string>} text Array of comments randomly selected and commented.
 * @param {string} handle Username of the account that is to be visited.
 **/
async function followerInteract(num, numProf, text, handle) {
    await user(handle);
    await profFollower();
    for (let i = 0; i < numProf; i++) {
        await followerToProf(i + 1);
        if (await postCount() >= num && await pvtAcc() != 0) {
            await follow();
            await postSelect();
            for (let j = 0; j < num; j++) {
                await postLike();
                /* if commenting is not necessary, comment out the next line. */
                await comment(rand(text));
                await next();
            }
            await close();
            for (let k = 0; k < num + 1; k++) {
                await browser.navigate().back();
            }
        }
        await browser.navigate().back();
        await browser.wait(until.elementLocated(By.xpath("//h1[contains(.,'Follower')]")), 2000).click();
    }
    await close();
    await home();
}
 /**
 * Unfollows accounts from own following page.
 * @param {number} numProf Number of profiles to unfollow. "all" is also an argument
 * that unfollows all accounts.
 **/
async function ownUnfollow(numProf) {
    await profile();
    let n = await followingCount();
    await profFollowing();
    if (numProf == 'all') {
        for (let i = 0; i < n; i++) {
            await profUnfollow(i);
        }
    }
    else {
        for (let i = 0, j = n; i < numProf /* || i < n || j > 0 */; i++, j--) {
            // await profUnfollow(i + 1);
            /* when latest followed profiles are displayed below,
            use the below function and comment out the previous line. */
            await profUnfollow(j);
        }
    }
    await close();
    await home();
}
 /**
 * Comments on posts in the explore page.
 * @param {number} num Number of posts to interact with.
 * @param {Array<string>} text Array of comments that are randomly
 * chosen and commented on posts.
 */
async function exploreComment(num, text) {
    await explore();
    await expSelect();
    for (let i = 0; i < num; i++) {
        await comment(rand(text));
        await next();
    }
    await close();
    await home();
}
 /**
 * Goes to accounts from posts in explore page and interacts with posts there.
 * @param {number} num Number of posts to interact with in the profile.
 * @param {number} numProf Number of profiles to visit from the explore page.
 * @param {Array<string>} text Array of comments that are randomly
 * chosen and commented on posts.
 **/
async function exploreToProfile(num, numProf, text) {
    for (let i = 0; i < numProf; i++) {
        await explore();
        await expSelect();
        for (let j = 0; j < i; j++) {
            await next();
        }
        await postToProf();
        await postSelect();
        for (let k = 0; k < num; k++) {
            await postLike();
            await comment(rand(text));
            await next();
        }
        await close();
    }
    await home();
}
 /**
 * Comments on posts in the top section of a tag page.
 * @param {string} hash The hastag who's tag page is to be reached.
 * @param {number} num Number of posts to be interacted with.
 * @param {Array<string>} text Array of comments that are randomly
 * chosen and commented on posts.
 **/
async function tagTopComment(hash, num, text) {
    await tag(hash);
    await topSelect();
    for (let i = 0; i < num; i++) {
        await comment(rand(text));
        await next();
    }
    await close();
    await home();
}
 /**
 * Comments on posts in the recent section of a tag page.
 * @param {string} hash The hastag who's tag page is to be reached.
 * @param {number} num Number of posts to be interacted with.
 * @param {Array<string>} text Array of comments that are randomly
 * chosen and commented on posts.
 **/
async function tagRecComment(hash, num, text) {
    await tag(hash);
    await recSelect();
    for (let i = 0; i < num; i++) {
        await comment(rand(text));
        await next();
    }
    await close();
    await home();
}
 /**
 * Goes to accounts from posts in tag page and interacts with posts there.
 * @param {string} hash The hastag who's tag page is to be reached.
 * @param {number} num Number of posts to interact with in the profile.
 * @param {number} numProf Number of profiles to visit from the tag page.
 * @param {Array<string>} text Array of comments that are randomly
 * chosen and commented on posts.
 **/
async function tagToProfile(hash, num, numProf, text) {
    for (let i = 0; i < numProf; i++) {
        await tag(hash);
        /* if recSelect is needed and not topSelect
        then keep next line and comment out topSelect(). */
        // await recSelect();
        await topSelect();
        for (let j = 0; j < i; j++) {
            await next();
        }
        await postToProf();
        await postSelect();
        for (let k = 0; k < num; k++) {
            await postLike();
            await next();
        }
        await comment(rand(text));
        await close();
    }
    await home();
}
/**
 * Goes to a specified list of top accounts and interacts with each one of them.
 * @param {number} num Number of posts to ineract with.
 * @param {number} numProf Number of profiles to interact with (maximum is profiles.length()).
 * @param {Array<string>} text Array of comments, if necessary.
 * @param {Array<string>} profiles Array of profiles that are to be visited.
 **/
async function celebProfile(num, numProf, text, profiles) {
    for (let i = 0; i < numProf; i++) {
        await user(profiles[i]);
        /* if following the profile is not required, comment out the next line. */
        await follow();
        /* if interacting with posts is not required, comment out the next line and close(). */
        for (let j = 0; j < num; j++) {
            await postSelect();
            await comment(rand(text));
            await next();
        }
    }
    await close();
    await home();
}
 /**
 * Goes to accounts and interacts with their followers.
 * @param {number} num Number of posts to interact with.
 * @param {number} numFollowers Number of followers of the celeb to interact with. 
 * @param {number} numProf Number of profiles to interact with (maximum is profiles.length()).
 * @param {Array<string>} text Array of comments to be randomly chosen and commented.
 * @param {Array<string>} profiles Array of profiles that are to be visited.
 **/
async function celebFollowerInteract(num, numFollowers, numProf, text, profiles) {
    for (let i = 0; i < numProf; i++) {
        await followerInteract(num, numFollowers, text, profiles[i + 25]);
    }
}
 /**
 * Goes to top profiles directory and interacts with accounts there.
 * @param {number} num Number of posts to interact with inside profile page.
 * @param {number} numProf Number of profiles in the top profiles section
 * that are to be interacted with.
 * @param {Array<string>} text Array of comments that are randomly
 * chosen and commented on posts.
 **/
async function topProfile(num, numProf, text) {
    for (let i = 0; i <= numProf; i++) {
        await topAcc();
        await topAccounts(i);
        for (let j = 0; j < num; j++) {
            await postSelect();
            await comment(rand(text));
            await next();
        }
        await close();
    }
    await home();
}

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
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//a[contains(.,'Next')]")), 2000).click();
    }
    catch (e) {
        console.error("Couldn't locate the next button: " + e);
        await close();
    }
}
 /**
 * Clicks the previous button on a post in a profile.
 * If it can't do that, it tries skipping past the task.
 **/
async function prev() {
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//a[contains(.,'Previous')]")), 2000).click();
    }
    catch (e) {
        console.error("Couldn't locate the previous button: " + e);
        await close();
    }
}
 /**
 * Clicks the close button on a post in a profile.
 * If it can't do that, it tries skipping past the task and goes to the home page.
 **/
async function close() {
    await sleep(2);
    try {
        await browser.wait(until.elementLocated(By.xpath("//*[name() = 'svg'][@aria-label = 'Close']")), 2000).click();
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
        await browser.wait(until.elementLocated(By.xpath(`//li[${n}]/div/div[2]/div/div/div/span`)), 5000).click();
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
export { startIG, stopIG, login, likeHome, dislikeHome, suggestedFollow,
            profFollow, ownUnfollow, exploreComment, exploreToProfile,
            tagTopComment, tagRecComment, tagToProfile, celebProfile, topProfile,
            celebFollowerInteract, followerInteract };
