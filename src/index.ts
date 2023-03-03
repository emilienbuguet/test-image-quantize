import Jimp from 'jimp';
import quantize from 'quantize';

export async function quantizeImageFile(path: string) {
    const {rgb, width, height, alpha} = await img2rgb(path);
    const newRgb = await rgb2newRgb(rgb);
    const newPath = path.replace(/(jpg|jpeg|png|gif)$/i, 'quantized.$1');
    await newRgb2img(newRgb, width, height, newPath, alpha);

    return newPath;
}

async function newRgb2img(rgb: [number, number, number][], width: number, height: number, path: string, alpha: number[]) {
    return new Promise((resolve, reject) => {
        new Jimp(width, height, (err: any, image: any) => {
            if (err) return reject(err)
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x: number, y: number, idx: number) {
                image.bitmap.data[idx] = rgb[idx / 4][0]
                image.bitmap.data[idx + 1] = rgb[idx / 4][1];
                image.bitmap.data[idx + 2] = rgb[idx / 4][2];
                image.bitmap.data[idx + 3] = alpha[idx / 4];
            })
            image.write(path);
            resolve(null);
        });
    });
}
async function img2rgb(path: string) {
    const img = await Jimp.read(path);
    const rgb: [number, number, number][] = [];
    const alpha: number[] = [];
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, (x: any, y: any, idx: number) => {
        rgb.push([
            img.bitmap.data[ idx ],
            img.bitmap.data[ idx + 1 ],
            img.bitmap.data[ idx + 2 ],
        ]);
        alpha.push(img.bitmap.data[ idx + 3 ])
    });

    return {rgb, width: img.bitmap.width, height: img.bitmap.height, alpha: alpha};
}

async function rgb2newRgb(rgb: [number, number, number][]) {
    const maximumColorCount = 256;

    const colorMap = quantize(rgb, maximumColorCount);

    return rgb.map(x => colorMap.map(x));
}