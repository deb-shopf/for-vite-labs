const QRCode = require("qrcode");
const { createCanvas, loadImage } = require("canvas");
const fs = require('fs');
const { textToBarCodeBase64 } = require('./genBase64');
async function create(seed, address, width, height) {
    const base64Seed = await textToBarCodeBase64(seed);
    const base64address = await textToBarCodeBase64(address);
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    //background color- white
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.font = 'bold 70pt Menlo'
    context.textAlign = 'center';
    // text color- black
    context.fillStyle = '#000000'
    // mint address
    context.fillText(address.toString(), 7200, 4100);
    // mint seed phrase ->split the seed phrase into multuple line otherwise it will ovelap with the address
    const words = seed.split(' ');
    var lines = ['', '', ''];
    var i = 0, j = 0;
    while (i < words.length) {
        lines[j] = lines[j] + ' ' + words[i];
        i++;
        if (i % 8 == 0) {
            j++;
        }
    }
    let lineHeight = 100;
    for (let i = 0; i < lines.length; i++) {
        context.fillText(lines[i], 2400, (4100 + (lineHeight * i)));
    }
    // mint qr code in the image
    loadImage(base64address).then(image => {
        loadImage(base64Seed).then(image2 => {
            context.drawImage(image, 5600, 800, 3200, 3200);
            context.drawImage(image2, 800, 800, 3200, 3200);
            const buffer = canvas.toBuffer('image/jpeg');
            fs.writeFileSync('./output/card.jpeg', buffer);
        })
    }).catch(err => {
        console.error(err);
    });
}

const genCard = async (seed, address) => {
    create(
        seed,
        address,
        9600,
        4800
    )
}

module.exports = {
    genCard
};
