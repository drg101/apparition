import locate from "./Locate.js";
import Fuse from 'fuse.js';


const select = async (descriptor, option_descriptor, page, cursor) => {
    const p = await locate(descriptor, page, cursor);
    cursor.click();
    const selectables = await page.evaluate(async (p, option_descriptor) => {
        const select_parent = document.elementFromPoint(p.x, p.y);
        const select_options = Array.from(select_parent.children).map(e => {
            return {
                innerText: e.innerText,
                value: e.value
            }
        })
        return select_options;
    }, p, option_descriptor)

    const fuse = new Fuse(selectables, {
        includeScore: true,
        keys: ['innerText', 'value']
    });

    const res = fuse.search(option_descriptor);
    const selectable_to_click_on = res[0].item
    selectable_to_click_on.score = res[0].score

    const value_to_click_on = selectable_to_click_on.value;

    await page.evaluate(async (p, value_to_click_on) => {
        const select_parent = document.elementFromPoint(p.x, p.y);
        select_parent.value = value_to_click_on;
        select_parent.dispatchEvent(new Event('change'));
    }, p, value_to_click_on)
}

export default select;