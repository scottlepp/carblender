// https://www.cars.com/for-sale/searchresults.action/
//?dealerType=all&mdId=47843&mkId=20001&page=1&perPage=20&rd=20&searchSource=GN_REFINEMENT&sort=relevance&stkTypId=28881&zc=49348

// https://www.cars.com/for-sale/searchresults.action/
// ?mdId=30005&mkId=20081&page=1&perPage=20&rd=20&searchSource=NEW_SEARCH&sort=relevance&stkTypId=28881&zc=49348

// https://www.cars.com/for-sale/searchresults.action/?mkId=porsche&mdId=panamara&page=1&perPage=20&searchSource=NEW_SEARCH&sort=relevance&stkTypId=28881&zc=49348
// https://www.cars.com/for-sale/searchresults.action/?mdId=30005&mkId=20081&page=1&perPage=20&rd=20&searchSource=NEW_SEARCH&sort=relevance&stkTypId=28881&zc=49348

import puppeteer from 'puppeteer';
import mapping from './mapping';

const site = 'https://www.cars.com/for-sale/';
const searchUrl = `${site}searchresults.action/`;
const searchSuffix = '&page=1&perPage=20&searchSource=NEW_SEARCH&sort=relevance&stkTypId=28881';

const search = async (filters) => {
  const browser = await puppeteer.launch(
    {
      headless: true  //change to true in prod!
    }
  )
  let page = await browser.newPage()

  page.on('console', msg => {
    const m:any = msg;
    for (let i = 0; i < m._args.length; ++i)
        console.log(`${i}: ${m._args[i]}`);
    });

  // workaround bot detection
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
  });

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')

  let url = searchUrl;
  let sep = '?';
  if (filters.make) {
    let param = mapping.query.make;
    let make = mapping.cars[filters.make];
    url += `${sep}${param}=${make.alias}`;
    sep = '&';
    if (filters.model) {
      param = mapping.query.model;
      let model = make.models[filters.model];
      url += `${sep}${param}=${model}`;
    }
  }
  url = url += searchSuffix;
  if (filters.price) {
    if (filters.price.min) {
      url += sep + 'prMn=' + filters.price.min
    }
    if (filters.price.max) {
      url += sep + 'prMx=' + filters.price.max
    }
    sep = '&';
  }

  console.log(url)

  await page.goto(url, {
    waitUntil: 'networkidle2',
  })

  const cars = await page.evaluate(() => {
    const listing = document.querySelector('#listings');
    let [...nodes] = listing.querySelectorAll('.shop-srp-listings__listing-container');
    console.log('found ' + nodes.length);
    return nodes.map(node => {
      // console.log('node')
      const title = node.querySelector('.listing-row__title');
      const imgWrapper = node.querySelector('.photo-scroll-wrapper');
      let thumb = '';
      if (imgWrapper) {
        // console.log('imgWrapper')
        const img = imgWrapper.childNodes[1];
        // console.log(img);
        thumb = img.getAttribute('style');
        // console.log('thumb ' + thumb)
        if (thumb) {
          thumb = thumb.replace('background-image: url(', '');
          thumb = thumb.replace(');', '');
        } else {
          thumb = img.getAttribute('data-lazy-style');
          if (thumb) {
            thumb = thumb.replace('background-image: url(', '');
            thumb = thumb.replace(');', '');
          }
        }
      }
      let cleanTitle = title.textContent;
      cleanTitle = cleanTitle.trim();
      return {title: cleanTitle, thumb}
    })//.filter(car => car.thumb !== null)
  });

  browser.close();

  return cars;
}

export default search;
