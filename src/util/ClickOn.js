import locate from "./Locate.js"

const click_on = async (descriptor, page, cursor) => {
    try {
        await locate(descriptor, page, cursor);
        cursor.click()
    }
    catch (e) {
        console.error(e)
    }
}

export default click_on;