const fs = require('fs');
const puppeteer = require('puppeteer');
const indexFilePath = __dirname + "/index.html";
const imagesPath = __dirname + "/images";
const contentPath = __dirname + "/content.txt";

function randIndex(length) {
   return Math.floor(Math.random()*length);
}

function readContent(path) {
    try {  
        var data = fs.readFileSync(path, 'utf8');
        return data.toString();    
    } catch(e) {
        return "";
    }
}

var images = fs.readdirSync(imagesPath);
var imageRandIndex = randIndex(images.length);
var imagePath = __dirname + "/" + images[imageRandIndex];
var lines = readContent(contentPath).split('\n').map(item => {
    const tokens = item.split('|');
    const title = tokens[0];
    const content = tokens[1];
    return {
        title,
        content
    }
})
var contentRandIndex = randIndex(lines.length);
var line = lines[contentRandIndex];
console.log(line);

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 2400,
        height: 1600,
        deviceScaleFactor: 1,
    });
    
    await page.goto("file://" + indexFilePath);
    await page.screenshot({path: "wallpaper.png"});
    await browser.close();
}

run().then(() => {
    console.log("Done")
})