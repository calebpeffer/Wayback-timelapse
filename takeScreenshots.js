const puppeteer = require('puppeteer');
const fs = require('fs');
const { getURLs } = require('./wayback');

async function takeScreenshotOfPage(url, browser, page, filename, screenshotFolderName) {
  // console.log("taking screenshot of ", url);

  await page.goto(`${url}`, {
    /// domcontentloaded
    /// networkidle0
    timeout: 60000,
    waitUntil: "load",
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


  ///if folder at screenshotFolderName doesn't exist, create it
  if (!fs.existsSync(screenshotFolderName)){
    console.log(`Creating folder ${screenshotFolderName}`);
    fs.mkdirSync(screenshotFolderName);
  }
  
  await page.screenshot({ path: `${screenshotFolderName}/${filename}.png` });
}

async function run() {

  /// Set these variables:
  const url = 'https://www.airbnb.com/';
  const maxNumberOfCaptures = 150;
  const startYear = 2007;
  const endYear = 2022;
  const screenshotFolder = "screenshots";


  /// Allows you to set how many caputures you want to take per year
  /// For more info on the collapse parameter, follow the official Wayback machine API docs:
  /// https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server#basic-usage

  const collapse = 'timestamp:6;'
  const windowSize= { width: 1366, height: 1366 } 

  const browser = await puppeteer.launch({ headless: false });
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
  
  let count = 0;
  for(let url of urls){
    try{
      await takeScreenshotOfPage(url, browser, page, count, screenshotFolder);


      ///Split URl around / and take the 4th element
      let timestamp = url.split("/")[4]; 


      ///Save Url and index to a new line in imageInfo.txt
      fs.appendFileSync('imageInfo.txt', `${url} ${count} ${timestamp}` + "\n");
    
      count++;
    } catch(e){
      console.log(e);
    }
    
  }

  browser.close();
}

run();
