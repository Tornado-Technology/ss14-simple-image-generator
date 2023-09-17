const loadImage = require('image-pixels');
const Jimp = require('jimp');
const fs = require('fs');

const character = '██';
const colors = 10;
const maxSize = 8000;

const decToHex = (dec) => dec.toString(16).padStart(2, '0');
const rgbToHex = (pixels, i) => {
    return `#${decToHex(pixels[i])}${decToHex(pixels[i + 1])}${decToHex(pixels[i + 2])}`;
}

(async () => {
    console.log('Resize image...');
    const image = await Jimp.read('image.png');
    await image.resize(20, 20, (err) => {
        if (err) throw err;
    }).write('image.png');

    console.log('Loading image...');
    var { data, width, height } = await loadImage('image.png');
    console.log('Image loaded!');
    
    console.log('Load image data...');
    const pixels = [];
    let i = 0;
    for (let x = 0; x < width; x++) {
        pixels[x] = [];
        for (let y = 0; y < height; y++) {
            pixels[x][y] = rgbToHex(data, i);
            i += 4;
        }
    }
    console.log('Image data loaded!');

    const line = [];
    pixels.forEach((colum) => {
        line.concat(colum);
    });


    
    console.log('Generate text...');
    let string = '';
    pixels.forEach((colum) => {
        let last = '';

        colum.forEach((pixel) => {
            if (pixel !== last && last !== '') {
                string += '[/color]';
            }

            if (last === '') {
                string += `[color=${pixel}]`;
            } else if (pixel !== last) {
                string += `[color=${pixel}]`;
            }
            
            string += character;
            last = pixel;
        });

        string += '[/color]\r';
    });
    console.log(`Done (${string.length / maxSize * 100}%)`)

    fs.writeFileSync('image.txt', string);
})();

