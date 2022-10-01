const fs = require('fs');
const puppeteer = require('puppeteer');
const indexSrcFilePath = __dirname + "/index_src.html";
const indexDestFilePath = __dirname + "/index_dest.html";
const imagesPath = __dirname + "/images";
const contentPath = __dirname + "/content.txt";
const { exec } = require("child_process");
const request = require('request');

function randIndex(length) {
   return Math.floor(Math.random()*length);
}

function getRemoteContent() {
    return new Promise((resolve, reject) => {
        request('https://raw.githubusercontent.com/hzung/mac-auto-wallpaper/main/content.txt', { json: true }, (err, res, body) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(body);
        });
    })
}

function readContent(path) {
    try {  
        var data = fs.readFileSync(path, 'utf8');
        return data.toString();    
    } catch(e) {
        return "";
    }
}

function writeFileContent(path, content) {
    fs.writeFileSync(path, content);
}

var images = fs.readdirSync(imagesPath);
var imageRandIndex = randIndex(images.length);
var imagePath = imagesPath + "/" + images[imageRandIndex];

getRemoteContent().then(content => {
    var lines = content.split('\n').map(item => {
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
    var wallpaperPath = __dirname + "/wallpaper_" + contentRandIndex + ".png";
    var indexContent = readContent(indexSrcFilePath);
    indexContent = indexContent.replaceAll("!!IMAGE", imagePath);
    indexContent = indexContent.replaceAll("!!TITLE", line.title);
    indexContent = indexContent.replaceAll("!!CONTENT", line.content);
    writeFileContent(indexDestFilePath, indexContent);
    
    async function run() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({
            width: 2400,
            height: 1600,
            deviceScaleFactor: 1,
        });
        
        await page.goto("file://" + indexDestFilePath);
        
        await page.screenshot({path: wallpaperPath});
        await browser.close();
    }
    
    run().then(() => {
        const command = `osascript -e 'tell application \"Finder\" to set desktop picture to POSIX file \"` + wallpaperPath + `\"'`;
        console.log("Execute command: " + command)
        exec(command, (error, stdout, stderr) => {
            console.log("Done")
        });
    });
})
