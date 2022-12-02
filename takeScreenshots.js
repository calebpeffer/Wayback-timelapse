const puppeteer = require('puppeteer');
const fs = require('fs');
const { getURLs } = require('./wayback');

const { exec } = require('child_process');


async function takeScreenshotOfPage(url, browser, page, filename, screenshotFolderName) {
  // console.log("taking screenshot of ", url);

  await page.goto(`${url}`, {
    /// domcontentloaded
    /// networkidle0
    /// load
    timeout: 40000,
    waitUntil: "networkidle0",
  });

  
  ///Wait for Wayback navigation to appear in DOM then delete it
  await page.waitForXPath(`//*[@id="wm-ipp-base"]`);
  await page.evaluate(async (ID) => { 

  //   const selectors = Array.from(document.querySelectorAll("img"));
  //   await Promise.all(selectors.map(img => {
  //   if (img.complete) return;
  //   return new Promise((resolve, reject) => {
  //     img.addEventListener('load', resolve);
  //     img.addEventListener('error', reject);
  //   });
  // }));

    var element = document.getElementById(ID);
    element.parentNode.removeChild(element);
  }, "wm-ipp-base"); 


  
  
  await page.screenshot({ path: `${screenshotFolderName}/${filename}.png` });
}

async function run(url, outputFileName) {

  /// Set these variables:
  // const url = url;
  const maxNumberOfCaptures = 300;
  const startYear = 2000;
  const endYear = 2022;
  const screenshotFolderName = `screenshots-${outputFileName}`;
  
  const startIndex = 0; ///Set the start index to 0 if you want to start from the beginning of the list of URLS


  /// Allows you to set how many caputures you want to take per year
  /// For more info on the collapse parameter, follow the official Wayback machine API docs:
  /// https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server#basic-usage

  ///timestamp:4 means that the first 4 digits of the timestamp will be used to group captures
  ///digest means that only uniqe captures will be saved
  const collapse = 'timestamp:6';
  const windowSize= { width: 1366, height: 1366 }; 

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport(windowSize);

  ///Handle Error Dialogs Gracefully
  page.on( 'dialog', async dialog => {
    console.log( dialog.type() );
    console.log( dialog.message() );
    await dialog.accept();

  });


  let urls = await getURLs(url, maxNumberOfCaptures, startYear, endYear, collapse);
  console.log("urls", urls);
  
  let count = startIndex;

  console.assert(startIndex < urls.length, "startIndex is greater than the number of urls");



  ///if folder at screenshotFolderName doesn't exist, create it
  if (!fs.existsSync(screenshotFolderName)){
    console.log(`Creating folder ${screenshotFolderName}`);
    fs.mkdirSync(screenshotFolderName);
  } else {
    ///delete existing folder then create it again
    console.log(`Deleting folder ${screenshotFolderName}`);
    exec(`rm -rf ${screenshotFolderName}`, (err, stdout, stderr) => {
      if (err) {
        console.log(`Error deleting folder ${screenshotFolderName}`);
        return;
      }
      console.log(`Deleted folder ${screenshotFolderName}`);
      fs.mkdirSync(screenshotFolderName);
    });
    
  }
  let metaDataPath = `${screenshotFolderName}/imageInfo-${screenshotFolderName}.txt`;

  /// if metaDataPath exists, delete it
  if (fs.existsSync(metaDataPath)){
    fs.unlinkSync(metaDataPath);
  } else {
    console.log(`Creating file ${metaDataPath}`);
    ///Create file with metaDataPath 
    fs.writeFileSync(metaDataPath, "");
  }
  
  // setTimeout(function(){
  //   console.log("Done");
  // }, 5000);

  for(let url of urls.slice(startIndex)) {
    try{
      await takeScreenshotOfPage(url, browser, page, count, screenshotFolderName);


      ///Split URl around / and take the 4th element
      let timestamp = url.split("/")[4]; 

      ///Save Url and index to a new line in imageInfo.txt
      fs.appendFileSync(metaDataPath, `${url} ${count} ${timestamp}` + "\n");
    
      count++;
    } catch(e){
    console.log(e);
    }
    
  }

  browser.close();
}

///read command line arguments into an array
const args = process.argv.slice(2);

let url;
let outputFilename
/// if the first argument is the url to take screenshots of, set the url variable to it
if(args[0]){
  url = args[0];
} else {
  console.log("Please enter a url as the first argument");
  process.exit(1);
}

if(args[1]){
  outputFilename = args[1];
} else {
  console.log("Please enter an output filename as the second argument");
  process.exit(1);
}

console.log("url", url);
console.log("outputFilename", outputFilename);

run(url, outputFilename);


/// wait for 2 seconds


///run the python file createGif.py
// exec('python createGif.py', (err, stdout, stderr) => {
//   if (err) {
//     //some err occurred
//     console.error(err)
//   } else {
//     // the *entire* stdout and stderr (buffered)
//     console.log(`stdout: ${stdout}`);
//     console.log(`stderr: ${stderr}`);
//   }
// });
