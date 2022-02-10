import browse from "./scripts/Browse.js";
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
// import go_to_email from "./scripts/GoToEmail.js";

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
browse(browser, )

