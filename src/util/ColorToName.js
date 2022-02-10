import chroma from "chroma-js";

const color_names = {
    blue: "#0000FF",
    green: "#00FF00",
    red: "#FF0000",
    white: "#FFFFFF",
    black: "#000000"
}

const color_to_name = (color) => {
    const colorToFind = chroma(color);
    const distances = Object.entries(color_names).map(([name, hex]) => {
        return {
            name,
            d: chroma.deltaE(colorToFind, chroma(hex))
        }
    }).sort((a,b) => a.d - b.d)

    return distances[0]
} 

export default color_to_name;
