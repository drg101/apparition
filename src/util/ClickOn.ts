import { GhostCursor } from "ghost-cursor";
import { Page } from "puppeteer";
import locate from "./Locate.js"

const click_on = async (descriptor: string, page: Page, cursor: GhostCursor) => {
    try {
        await locate(descriptor, page, cursor);
        cursor.click()
    }
    catch (e) {
        console.error(e)
    }
}

export default click_on;