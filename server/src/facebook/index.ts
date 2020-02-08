// https://www.facebook.com/marketplace/search/?query=porsche%20panamera&vertical=C2C&sort=BEST_MATCH

import puppeteer from 'puppeteer-extra';
// import mapping from './mapping';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin())

const site = 'https://www.facebook.com/';
const searchUrl = `${site}marketplace/category/vehicles/`;
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
    let param = 'vehicleMake';
    let make = filters.make;
    url += `${sep}${param}=${make}`;
    sep = '&';
    if (filters.model) {
      url += `${sep}vehicleModel=${filters.model}`;
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

  await page.waitForSelector('div[data-testid="marketplace_category_feed"]', {
    timeout: 6000
  })

  const cars = await page.evaluate( () => {

    //page.waitFor(30000).then(() => {
      // 'div[data-qa="result-tile"]'
      const listing = document.querySelector('div[data-testid="marketplace_category_feed"]');
      console.info('results sectin ' + listing);
      let [...nodes] = listing.querySelectorAll('a[data-testid="marketplace_feed_item"]');
      console.info('found ' + nodes.length);
      return nodes.map(node => {
        // console.log('node')
        const title = node.querySelector('#marketplace-modal-dialog-title');
        const img = node.querySelector('img');
        let thumb = '';
        if (img) {
          // console.log('imgWrapper')
          // console.log(img);
          thumb = img.getAttribute('src');
          // console.log('thumb ' + thumb)
        }
        let cleanTitle = title.getAttribute('title');
        cleanTitle = cleanTitle.trim();
        return {title: cleanTitle, thumb}
      })//.filter(car => car.thumb !== null)
    //})


  });

  // browser.close();

  return cars;
}

export default search;
