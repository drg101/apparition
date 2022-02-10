import randomNormal from "random-normal";

const keyboard = async (text_to_enter, page, wpm = 105) => {
    const timeoutTime = 60000 / wpm / 5;
    for (const character of text_to_enter){
        page.keyboard.type(character)
        await page.waitForTimeout(timeoutTime + randomNormal() * timeoutTime * 0.7)
    }
}

export default keyboard;