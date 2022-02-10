import tesseract from "node-tesseract-ocr"
let count = 0
const get_image_text = async (img) => {
    try {
        const ocr = await tesseract.recognize(img, {
            oem: 1,
            "tessdata-dir": "/home/drg101/Personal/troll/src/tessdata/",
            lang: "eng"
        })
        console.log({ c: count++ })

        return ocr;
    }
    catch (e) {
        console.log(e)
        return ""
    }
}

export default get_image_text;