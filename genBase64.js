const QRCode = require('qrcode');

const textToBarCodeBase64 = address => {
    if (!address) {
        return;
    }

    return new Promise((resolve, reject) => {
        QRCode.toBuffer(
            address,
            { type: 'terminal' },
            (error, buffer) => {
                if (error) {
                    reject(error);
                } else {
                    const base64 = `data:image/gif;base64,${buffer.toString('base64')}`;
                    resolve(base64);
                }
            })
    });
};
module.exports = {
    textToBarCodeBase64
};