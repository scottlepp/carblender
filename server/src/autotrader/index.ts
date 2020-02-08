// https://www.facebook.com/marketplace/search/?query=porsche%20panamera&vertical=C2C&sort=BEST_MATCH

import puppeteer from 'puppeteer-extra';
// import mapping from './mapping';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// puppeteer.use(StealthPlugin())

const site = 'https://www.autotrader.com/';
let searchUrl = `${site}cars-for-sale/Porsche/Panamera/Middleville+MI-49333?searchRadius=200&numRecords=100&firstRecord=0`;
// searchUrl = 'https://www.autotrader.com/cars-for-sale/Acura/Middleville+MI-49333?searchRadius=0&zip=49333&marketExtension=include&makeCodeList=ACURA&isNewSearch=true&sortBy=relevance&numRecords=25&firstRecord=0'
const searchSuffix = '';

const search = async (filters) => {
  const browser = await puppeteer.launch(
    {
      headless: false  //change to true in prod!
    }
  )
  let page = await browser.newPage()

  page.on('console', msg => {
    const m:any = msg;
    for (let i = 0; i < m._args.length; ++i)
        console.log(`${i}: ${m._args[i]}`);
    });

  let url = searchUrl;
  let sep = '?';
  if (filters.make) {
    let make = filters.make;
    url += `/${filters.make}`;
    if (filters.model) {
      url += `/${filters.model}`;
    }
  }
  url = url += searchSuffix;
  if (filters.price) {
    if (filters.price.min) {
      url += sep + 'min_price=' + filters.price.min
    }
    if (filters.price.max) {
      url += sep + 'max_price=' + filters.price.max
    }
    sep = '&';
  }

  await page.goto(url, {
    waitUntil: 'networkidle2',
  })

  // await page.waitFor(5000);

  await page.setViewport({
    width: 1200,
    height: 800
  });

  await autoScroll(page);

  const cars = await page.evaluate( () => {

    //page.waitFor(30000).then(() => {
      // 'div[data-qa="result-tile"]'
      const listing = document.querySelector('div[data-qaid="cntnr-listings-tier-listings"]');
      if (listing) {
        console.info('results sectin ' + listing);
        let [...nodes] = listing.querySelectorAll('.inventory-listing');
        console.info('found ' + nodes.length);
        return nodes.map(node => {
          // console.log('node')
          const title = node.querySelector('h2[data-cmp="subheading"]');
          const img = node.querySelector('img[data-cmp="inventoryImage"]');
          let thumb = '';
          if (img) {
            // console.log('imgWrapper')
            // console.log(img);
            thumb = img.getAttribute('src');
            // console.log('thumb ' + thumb)
          }
          return {title: title.textContent, thumb}
        })//.filter(car => car.thumb !== null)
      } else {
        return [];
      }

    //})


  });

  browser.close();

  return cars;
}

export default search;

// image links aren't populated until scrolling into view
async function autoScroll(page){
  await page.evaluate( () => {
      return new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 50);
      });
  });
}
