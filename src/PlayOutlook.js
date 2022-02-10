import puppeteer from 'puppeteer'
import locate from './util/Locate.js';
import click_on from './util/ClickOn.js';
import select from './util/Select.js';
import pkg from 'ghost-cursor';
const { installMouseHelper } = pkg;
import { createCursor } from 'ghost-cursor';
import Fakerator from 'fakerator';
import keyboard from './util/Keyboard.js';
import prompt from 'prompt';
import create_fake_user from './util/CreateFakeUser.js';
import numeric_month_to_month from './util/NumericMonthToMonth.js';
import { add_to_firestore } from './util/Firestore.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs from 'fs';
import make_new_chrome_profile from './util/MakeNewChromeProfile.js';



const fakerator = Fakerator();

(async () => {
    const profile_id = Math.random().toString(36).substring(2, 8);
    const user_data_dir = make_new_chrome_profile(profile_id);
    const browser = await puppeteer.launch({ 
        headless: false, 
        defaultViewport: null,
        args: [
            '--disable-web-security',
            '--disable-site-isolation-trials',
            `--user-data-dir=${user_data_dir}`
        ] 
    });
    const context = browser.defaultBrowserContext();
    context.overridePermissions("https://www.reddit.com", ["geolocation", "notifications"]);
    const page = await browser.newPage();
    const cursor = createCursor(page)
    // cursor.toggleRandomMove(true)
    installMouseHelper(page);
    await page.goto('https://google.com');

    await click_on('search', page, cursor);
    await keyboard('outlook email', page)
    await page.keyboard.press("Enter")
    await page.waitForNavigation({waitUntil: 'networkidle2'});
    await click_on('Outlook free personal email and calendar from Microsoft', page, cursor);
    await page.waitForNavigation({waitUntil: 'networkidle2'});

    await click_on('create free account', page, cursor);


    const fake_user = create_fake_user('M', 'outlook')

    await page.waitForNavigation({waitUntil: 'networkidle2'});
    await click_on('new email', page, cursor);
    await keyboard(fake_user.username, page)
    await click_on('next', page, cursor)

    // await page.waitForNavigation({waitUntil: 'networkidle2'});
    await page.waitForTimeout(2000)
    await click_on('create password', page, cursor);
    await keyboard(fake_user.password, page)
    await click_on('blue next', page, cursor)

    await page.waitForTimeout(1500)
    await click_on('first name', page, cursor);
    await keyboard(fake_user.first_name, page)
    await click_on('last name', page, cursor)
    await keyboard(fake_user.last_name, page)
    await click_on('blue next', page, cursor)


    await page.waitForTimeout(1500)
    await select("month", numeric_month_to_month(fake_user.birth_month), page, cursor)
    await select("day", `${fake_user.birth_day}`, page, cursor)
    await click_on("year", page, cursor)
    await keyboard(`${fake_user.birth_year}`, page)
    await click_on("blue next", page, cursor)

    await page.waitForTimeout(10000)
    // await click_on("blue next", page, cursor)
    // await click_on("blue next", page, cursor)
    await prompt.get('done w/ captcha?');
    await click_on("no", page, cursor)

    console.log(fake_user)

    console.log("^^^ Adding to firestore ^^^")
    await add_to_firestore("users", fake_user)
    console.log("Added to firestore")
    
    // console.log('Dimensions:', dimensions);

    // await browser.close();
})();