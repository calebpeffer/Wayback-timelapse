const puppeteer = require('puppeteer');
const fs = require('fs');
const { getURLs } = require('./wayback');


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function takeScreenshotOfPage(url, browser, page, filename) {
  console.log("taking screenshot of ", url);

  await page.goto(`${url}`, {
    // domcontentloaded
    // networkidle0
    timeout: 60000,
    waitUntil: "load",
  });

  

  await page.waitForXPath(`//*[@id="wm-ipp-base"]`);

  await page.evaluate(async (ID) => { 

    const selectors = Array.from(document.querySelectorAll("img"));
    await Promise.all(selectors.map(img => {
    if (img.complete) return;
    return new Promise((resolve, reject) => {
      img.addEventListener('load', resolve);
      img.addEventListener('error', reject);
    });
  }));

    
    var element = document.getElementById(ID);
    // console.log(element);
    element.parentNode.removeChild(element);
  }, "wm-ipp-base"); 

  await page.screenshot({ path: `screenshots1/${filename}.png` });
}

async function run() {


  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport( { width: 1366, height: 1366 } );
  page.on( 'dialog', async dialog => {
  
    console.log( dialog.type() );

    console.log( dialog.message() );

    await dialog.accept();

  });


  let urls = await getURLs('https://www.airbnb.com/', 150, 2007, 2022, 'timestamp:6');
  console.log("urls", urls);
  
  let count = 0;
  for(url of urls){
    try{
      await takeScreenshotOfPage(url, browser, page, count, "10");


      ///Split URl around / and take the 4th element
      let timestamp = url.split("/")[4]; 

      console.log("timestamp", timestamp);

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
