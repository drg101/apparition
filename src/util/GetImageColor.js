import { getAverageColor } from "fast-average-color-node";

const get_image_color = async (img) => {
    const avg_color = await getAverageColor(img);
    return avg_color.hex;
}

export default get_image_color;