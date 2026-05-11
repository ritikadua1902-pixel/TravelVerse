const fs = require('fs');
const src = 'C:\\Users\\ritik\\Downloads\\logo.jpeg';
const dest = 'c:\\Users\\ritik\\Downloads\\antigravity\\project\\tour-himachal\\frontend\\src\\assets\\logo.png';
const pubDest = 'c:\\Users\\ritik\\Downloads\\antigravity\\project\\tour-himachal\\frontend\\public\\logo.png';
fs.copyFileSync(src, dest);
fs.copyFileSync(src, pubDest);
console.log('Logo copied to assets and public!');
