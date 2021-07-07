import { By, until } from "selenium-webdriver";
import * as A from "./action.js";

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
    await A.browser.get("https://www.instagram.com/");
}
 /**
 * Logs into instagram.
 * @param {string} username Username of the account.
 * @param {string} password Password of the account.
 **/
async function login(username, password) {
    await A.loggingIn(username, password);
    /* if login details are to be saved, use sayYes()
    and comment out sayNo(). */
    // await sayYes();
    await A.sayNo();
    await A.home();
}
 /**
 * Quits the browser after waiting a while.
 * @param {number} wait Period for which the script stays
 * active before quitting the session.
 **/
async function stopIG(wait) {
    await sleep(wait);
    await A.browser.close();
}
 /**
 * Likes posts in home page.
 * @param {number} num Number of posts to like.
 **/
async function likeHome(num) {
    await A.homLike(num);
    await A.scroll("top");
}
 /**
 * Dislikes posts in home page.
 * @param {number} num Number of posts to dislike.
 **/
async function dislikeHome(num) {
    await A.homDislike(num);
    await A.scroll("top");
}
 /**
 * Follows suggested accounts.
 * @param {number} numProf Number of profiles to follow
 * in the suggestions page.
 **/
async function suggestedFollow(numProf) {
    for (let i = 0; i < numProf; i++) {
        await A.suggested();
        /* if going into the profiles each time is not required,
        then just loop the line below and comment out the rest up till home(). */
        // await A.sugFollow("fol");
        await A.sugFollow(i + 1);
        if (await A.pvtAcc() == 0) {
            await A.follow();
            await sleep(120);
            await A.browser.navigate().refresh();
            await sleep(1);
            if (await A.pvtAcc() == 1) {
                await A.postSelect();
                await A.postLike();
                await A.close();
            }
            else {
                await A.unfollow();
            }
        }
        else {
            await A.postSelect();
            await A.postLike();
            await A.close();
        }
        await A.suggested();
    }
    await A.home();
}
 /**
 * Follows and likes a post of specified profile.
 * @param {string} handle Username of the account that is to be visited.
 **/
async function profFollow(handle) {
    await A.user(handle);
    /* use this when liking all pictures in the account. */
    // let n = await postCount();
    if (await A.pvtAcc() == 0) {
        await A.follow();
        await sleep(120);
        await A.browser.navigate().refresh();
        if (await A.pvtAcc() == 1) {
            await A.postSelect();
            await A.postLike();
            await A.close();
        }
        else {
            await A.unfollow();
        }
    }
    else {
        await A.follow();
        await A.postSelect();
        /* to like all pictures in account, run through the for loop
        or else comment out the for loop and just like one post. */
        await A.postLike();
        // for (i = 0; i < n; i++) {
        //     await A.postLike();
        //     await A.next();
        // }
        await A.close();
    }
    await A.home();
}
 /**
 * Goes to specified account and interacts with the followers of that account.
 * @param {number} num Number of posts that are to interacted with.
 * @param {number} numProf Number of profiles that are to be interacted with.
 * @param {Array<string>} text Array of comments randomly selected and commented.
 * @param {string} handle Username of the account that is to be visited.
 **/
async function followerInteract(num, numProf, text, handle) {
    await A.user(handle);
    await A.profFollower();
    for (let i = 0; i < numProf; i++) {
        await A.followerToProf(i + 1);
        if (await A.postCount() > num && await A.pvtAcc() != 0) {
            await A.follow();
            await A.postSelect();
            for (let j = 0; j < num; j++) {
                await A.postLike();
                /* if commenting is not necessary, comment out the next line. */
                await A.comment(rand(text));
                await A.next();
            }
            await A.close();
            for (let k = 0; k < num + 1; k++) {
                await A.browser.navigate().back();
            }
        }
        await A.browser.navigate().back();
        await A.browser.wait(until.elementLocated(By.xpath("//h1[contains(.,'Follower')]")), 2000).click();
    }
    await A.close();
    await A.home();
}
 /**
 * Unfollows accounts from own following page.
 * @param {number} numProf Number of profiles to unfollow. "all" is also an argument
 * that unfollows all accounts.
 **/
async function ownUnfollow(numProf) {
    await A.profile();
    let n = await A.followingCount();
    await A.profFollowing();
    if (numProf == 'all') {
        for (let i = 0; i < n; i++) {
            await A.profUnfollow(i);
        }
    }
    else {
        for (let i = 0, j = n; i < numProf /* || i < n || j > 0 */; i++, j--) {
            // await profUnfollow(i + 1);
            /* when latest followed profiles are displayed below,
            use the below function and comment out the previous line. */
            await A.profUnfollow(j);
        }
    }
    await A.close();
    await A.home();
}
 /**
 * Comments on posts in the explore page.
 * @param {number} num Number of posts to interact with.
 * @param {Array<string>} text Array of comments that are randomly
 * chosen and commented on posts.
 */
async function exploreComment(num, text) {
    await A.explore();
    await A.expSelect();
    for (let i = 0; i < num; i++) {
        await A.comment(rand(text));
        await A.next();
    }
    await A.close();
    await A.home();
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
        await A.explore();
        await A.expSelect();
        for (let j = 0; j < i; j++) {
            await A.next();
        }
        await A.postToProf();
        await A.postSelect();
        for (let k = 0; k < num; k++) {
            await A.postLike();
            await A.comment(rand(text));
            await A.next();
        }
        await A.close();
    }
    await A.home();
}
 /**
 * Comments on posts in the top section of a tag page.
 * @param {string} hash The hastag who's tag page is to be reached.
 * @param {number} num Number of posts to be interacted with.
 * @param {Array<string>} text Array of comments that are randomly
 * chosen and commented on posts.
 **/
async function tagTopComment(hash, num, text) {
    await A.tag(hash);
    await A.topSelect();
    for (let i = 0; i < num; i++) {
        await A.comment(rand(text));
        await A.next();
    }
    await A.close();
    await A.home();
}
 /**
 * Comments on posts in the recent section of a tag page.
 * @param {string} hash The hastag who's tag page is to be reached.
 * @param {number} num Number of posts to be interacted with.
 * @param {Array<string>} text Array of comments that are randomly
 * chosen and commented on posts.
 **/
async function tagRecComment(hash, num, text) {
    await A.tag(hash);
    await A.recSelect();
    for (let i = 0; i < num; i++) {
        await A.comment(rand(text));
        await A.next();
    }
    await A.close();
    await A.home();
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
        await A.tag(hash);
        /* if recSelect is needed and not topSelect
        then keep next line and comment out topSelect(). */
        // await recSelect();
        await A.topSelect();
        for (let j = 0; j < i; j++) {
            await A.next();
        }
        await A.postToProf();
        await A.postSelect();
        for (let k = 0; k < num; k++) {
            await A.postLike();
            await A.next();
        }
        await A.comment(rand(text));
        await A.close();
    }
    await A.home();
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
        await A.user(profiles[i]);
        /* if following the profile is not required, comment out the next line. */
        await A.follow();
        /* if interacting with posts is not required, comment out the next line and close(). */
        for (let j = 0; j < num; j++) {
            await A.postSelect();
            await A.comment(rand(text));
            await A.next();
        }
    }
    await A.close();
    await A.home();
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
        await followerInteract(num, numFollowers, text, profiles[i + 45]);
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
        await A.topAcc();
        await A.topAccounts(i);
        for (let j = 0; j < num; j++) {
            await A.postSelect();
            await A.comment(rand(text));
            await A.next();
        }
        await A.close();
    }
    await A.home();
}


/* Here is the command to export the functions in the imaginary "do" class. */
export { startIG, stopIG, login, likeHome, dislikeHome, suggestedFollow,
            profFollow, ownUnfollow, exploreComment, exploreToProfile,
            tagTopComment, tagRecComment, tagToProfile, celebProfile, topProfile,
            celebFollowerInteract, followerInteract };
