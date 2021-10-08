const vite = require('@vite/vitejs');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const { genCard } = require('./canvas');

const { createMnemonics } = vite.wallet;

const myMnemonics = createMnemonics();

const { originalAddress, publicKey, privateKey, address } = vite.wallet.deriveAddress({
  mnemonics: myMnemonics,
  index: 0
});

genCard(myMnemonics, address);

console.log({ myMnemonics, originalAddress, publicKey, privateKey, address });