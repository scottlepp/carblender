// https://www.cars.com/for-sale/searchresults.action/
//?dealerType=all&mdId=47843&mkId=20001&page=1&perPage=20&rd=20&searchSource=GN_REFINEMENT&sort=relevance&stkTypId=28881&zc=49348

// https://www.cars.com/for-sale/searchresults.action/
// ?mdId=30005&mkId=20081&page=1&perPage=20&rd=20&searchSource=NEW_SEARCH&sort=relevance&stkTypId=28881&zc=49348

// https://www.cars.com/for-sale/searchresults.action/?mkId=porsche&mdId=panamara&page=1&perPage=20&searchSource=NEW_SEARCH&sort=relevance&stkTypId=28881&zc=49348
// https://www.cars.com/for-sale/searchresults.action/?mdId=30005&mkId=20081&page=1&perPage=20&rd=20&searchSource=NEW_SEARCH&sort=relevance&stkTypId=28881&zc=49348

import puppeteer from 'puppeteer';
import mapping from './mapping';
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// puppeteer.use(StealthPlugin())

const site = 'https://www.carfax.com/cars-for-sale';
//const searchUrl = `${site}Used-`;
const searchUrl = site;
const searchSuffix = '';

const search = async (filters) => {
  const browser = await puppeteer.launch(
    {
      headless: false  //change to true in prod!
    }
  )
  let page = await browser.newPage()

  // page.on('console', msg => {
  //   for (let i = 0; i < msg._args.length; ++i)
  //       console.log(`${i}: ${msg._args[i]}`);
  //   });

  // workaround bot detection
  // await page.setExtraHTTPHeaders({
  //   'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
  // });

  //await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')

  // Pass the User-Agent Test.
  const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
  'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
  await page.setUserAgent(userAgent);

  // Pass the Webdriver Test.
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
  });

  // Pass the Chrome Test.
  await page.evaluateOnNewDocument(() => {
    const navigator:any = window.navigator;
    // We can mock this in as much depth as we need for the test.
    navigator.chrome = {
      runtime: {},
      // etc.
    };
  });

// Pass the Permissions Test.
await page.evaluateOnNewDocument(() => {
  const navigator:any = window.navigator;
  const originalQuery = window.navigator.permissions.query;
  return navigator.permissions.query = (parameters) => (
    parameters.name === 'notifications' ?
      Promise.resolve({ state: Notification.permission }) :
      originalQuery(parameters)
  );
});

// Pass the Plugins Length Test.
await page.evaluateOnNewDocument(() => {
  // Overwrite the `plugins` property to use a custom getter.
  Object.defineProperty(navigator, 'plugins', {
    // This just needs to have `length > 0` for the current test,
    // but we could mock the plugins too if necessary.
    get: () => [1, 2, 3, 4, 5],
  });
});

// Pass the Languages Test.
await page.evaluateOnNewDocument(() => {
  // Overwrite the `plugins` property to use a custom getter.
  Object.defineProperty(navigator, 'languages', {
    get: () => ['en-US', 'en'],
  });
});

  let url = searchUrl;

  await page.goto(url, {
    waitUntil: 'networkidle2',
  })

  const cars = await page.evaluate(async () => {

    // const option = (await page.$x(
    //   '//*[@ = "selectId"]/option[text() = "Audi"]'
    // ))[0];
    // await page.select("select.search-make", "Porsche")
    await page.waitFor(30000)

    // const listing = document.querySelector('#listings');
    // let [...nodes] = listing.querySelectorAll('.shop-srp-listings__listing-container');
    // // console.log('found ' + nodes.length);
    // return nodes.map(node => {
    //   // console.log('node')
    //   const title = node.querySelector('.listing-row__title');
    //   const imgWrapper = node.querySelector('.photo-scroll-wrapper');
    //   let thumb = '';
    //   if (imgWrapper) {
    //     // console.log('imgWrapper')
    //     const img = imgWrapper.childNodes[1];
    //     // console.log(img);
    //     thumb = img.getAttribute('style');
    //     // console.log('thumb ' + thumb)
    //     if (thumb) {
    //       thumb = thumb.replace('background-image: url(', '');
    //       thumb = thumb.replace(');', '');
    //     } else {
    //       thumb = img.getAttribute('data-lazy-style');
    //       if (thumb) {
    //         thumb = thumb.replace('background-image: url(', '');
    //         thumb = thumb.replace(');', '');
    //       }
    //     }
    //   }
    //   let cleanTitle = title.textContent;
    //   cleanTitle = cleanTitle.trim();
    //   return {title: cleanTitle, thumb}
    //})//.filter(car => car.thumb !== null)
  });

  browser.close();

  return cars;
}

export default search;
