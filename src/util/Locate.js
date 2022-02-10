import Fuse from 'fuse.js';
import Jimp from "jimp";

import color_to_name from './ColorToName.js'
import get_area_image from './GetAreaImage.js'
import get_image_color from './GetImageColor.js'
import get_image_text from './GetImageText.js'

let count = 0;

const locate = async (descriptor, page, cursor) => {

    // const aHandle = await page.evaluateHandle('document'); // Handle for the 'document'
    const elements = await page.evaluate(async () => {
        function isVisible(elem, additional_offset={top: 0, left: 0}) {
            console.log({elem})
            const style = getComputedStyle(elem);

            // if (!(elem instanceof Element)) return false;
            if (style.display === 'none') return false;
            if (style.visibility !== 'visible') return false;
            if (style.opacity < 0.1) return false;
            if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
                elem.getBoundingClientRect().width === 0) {
                return false;
            }
            let elemCenter;
            console.log({ elem })
            try {
                elemCenter = {
                    x: elem.getBoundingClientRect().left + (elem.offsetWidth ?? elem.getBBox().width) / 2 + additional_offset.left,
                    y: elem.getBoundingClientRect().top + (elem.offsetHeight ?? elem.getBBox().height) / 2 + additional_offset.top
                };
            }
            catch {
                return false;
            }
            if (elemCenter.x < 0) return false;
            if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
            if (elemCenter.y < 0) return false;
            if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
            console.log({ x: elemCenter.x, y: elemCenter.y })
            let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
            while (pointContainer?.tagName === "IFRAME" && elem.tagName !== "IFRAME"){
                elemCenter.y -= pointContainer.getBoundingClientRect().top
                elemCenter.x -= pointContainer.getBoundingClientRect().left
                pointContainer = pointContainer.contentDocument.elementFromPoint(elemCenter.x, elemCenter.y);
            }
            do {
                if (!pointContainer) break;
                if (pointContainer === elem) return true;
            } while (pointContainer = pointContainer?.parentNode);
            return false;
        }

        const offset = (el) => {
            console.log({el})
            const rect = el.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
        }

        let base_elements_and_offsets = Array.from(document.getElementsByTagName('*')).map(element => {
            return {
                element,
                offset: { top: 0, left: 0 }
            }
        });

        let iframes_and_offsets = base_elements_and_offsets.filter(o => o.element.tagName === "IFRAME");

        let all_elements_and_offsets = base_elements_and_offsets;

        while (iframes_and_offsets.length) {
            const iframe_and_offset = iframes_and_offsets.shift()
            const additonal_offset = offset(iframe_and_offset.element)
            if (!iframe_and_offset.element.contentDocument){
                continue;
            }
            const additional_elements = Array.from(iframe_and_offset.element.contentDocument.body.getElementsByTagName("*")).map(element => {
                return {
                    element,
                    offset: {
                        top: iframe_and_offset.offset.top + additonal_offset.top,
                        left: iframe_and_offset.offset.left + additonal_offset.left
                    }
                }
            });
            const additional_iframes = additional_elements.filter(o => o.element.tagName === "IFRAME");
            iframes_and_offsets = [...iframes_and_offsets, ...additional_iframes]
            all_elements_and_offsets = [...all_elements_and_offsets, ...additional_elements]
        }


        const elements_text = all_elements_and_offsets.filter(element_and_offset => {
            return isVisible(element_and_offset.element, element_and_offset.offset)
        }).map(element_and_offset => {
            e = element_and_offset.element
            const outer_offset = element_and_offset.offset;
            const inner_offset = offset(element_and_offset.element)
            return {
                innerText: e.innerText,
                offset: {
                    top: inner_offset.top + outer_offset.top,
                    left: inner_offset.left + outer_offset.left
                },
                width: e.offsetWidth,
                height: e.offsetHeight,
                id: e.id ?? '',
                title: e.title ?? '',
                className: e.className ?? '',
                name: e.name ?? '',
                placeholder: e.placeholder ?? '',
                value: e.value ?? '',
                label: e.label ?? ''
            }
        });
        return elements_text
    });

    const page_screenshot_buffer = await page.screenshot();
    const screenshot_jimp = await Jimp.read(page_screenshot_buffer)
    const elements_bg_color_encoded = await Promise.all(elements.map(async e => {
        let color_hex;
        let ocr_text;
        try {
            const area_image = await get_area_image(screenshot_jimp, e.offset.left, e.offset.top, e.width, e.height)
            color_hex = await get_image_color(area_image);
            // ocr_text = await get_image_text(area_image);
            // console.log("s")
            ocr_text = ""
        }
        catch {
            color_hex = "#000000"
            ocr_text = ""
        }

        return {
            ...e,
            backgroundColor: color_to_name(color_hex).name,
            ocr_text
        }
    }));

    // console.log(elements_bg_color_encoded)

    const fuse = new Fuse(elements_bg_color_encoded, {
        includeScore: true,
        keys: ['innerText', 'title', 'id', 'name', 'placeholder', 'value', 'backgroundColor', 'ocr_text']
    });

    const res = fuse.search(descriptor);
    const element_to_click_on = res[0].item
    element_to_click_on.score = res[0].score
    console.log(element_to_click_on)
    console.log(descriptor)
    // await get_area_color(screenshot_jimp, element_to_click_on.offset.left, element_to_click_on.offset.top, element_to_click_on.width, element_to_click_on.height, page, true)


    const position_going_to = {
        x: element_to_click_on.offset.left + (element_to_click_on.width * (Math.random() / 2)) + (element_to_click_on.width / 4),
        y: element_to_click_on.offset.top + (element_to_click_on.height * (Math.random() / 2)) + (element_to_click_on.height / 4),
    }
    await cursor.moveTo(position_going_to);
    return position_going_to
}

export default locate;