const get_area_image = async (screenshot_jimp, x, y, width, height) => {
    // console.log({x,y,width,height})
    const cloned_screenshot_jimp = screenshot_jimp.clone();
    const area_of_relevance = cloned_screenshot_jimp.crop(x * 1.25, y * 1.25, width * 1.25, height * 1.25)
    const imbuf = await area_of_relevance.getBufferAsync('image/png');
    return imbuf;
}

export default get_area_image;