//https://www.edmunds.com/inventory/srp.html?inventorytype=used%2Ccpo&make=porsche&model=panamera&price=25000-50000

import puppeteer from 'puppeteer-extra';
// import puppeteer from 'puppeteer';
// import mapping from './mapping';
//import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// stealth doesn't work on edmunds
//puppeteer.use(StealthPlugin())

const site = 'https://www.edmunds.com/';
const searchUrl = `${site}inventory/srp.html?inventorytype=used%2Ccpo`;
const searchSuffix = '';

const search = async (filters) => {
  const browser = await puppeteer.launch(
    {
      headless: false  //change to true in prod!
    }
  )

  let url = searchUrl;
  let sep = '&';
  if (filters.make) {
    let param = 'make';
    let make = filters.make;
    url += `${sep}${param}=${make}`;
    sep = '&';
    if (filters.model) {
      param = 'model';
      url += `${sep}${param}=${filters.model}`;
    }
  }
  url = url += searchSuffix;
  if (filters.price) {
    if (filters.price.min) {
      url += sep + 'price=' + filters.price.min
    }
    if (filters.price.max) {
      url += '-' + filters.price.max
    }
    sep = '&';
  }

  const urlObj = new URL(url);

  const context = browser.defaultBrowserContext();
  context.clearPermissionOverrides();
  context.overridePermissions(urlObj.origin, ['geolocation']);

  let page = await browser.newPage()

  page.on('console', msg => {
    const m:any = msg;
    for (let i = 0; i < m._args.length; ++i)
        console.log(`${i}: ${m._args[i]}`);
    });

  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
  });

  // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')

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
// await page.evaluateOnNewDocument(() => {
//   // Overwrite the `plugins` property to use a custom getter.
//   Object.defineProperty(navigator, 'languages', {
//     get: () => ['en-US', 'en'],
//   });
// });

// await page.evaluateOnNewDocument(() => {
//   // Overwrite the `plugins` property to use a custom getter.
//   const nav:any = navigator;
//   if (nav.__proto__) {
//     delete nav.__proto__.webdriver;
//   }
//   Object.defineProperty(navigator, 'permissions', {
//     get: () => query,
//   });
// });

// navigator.permissions.query({name:'geolocation'}).then(function(result) {
//   if (result.state === 'granted') {
//     showMap();
//   } else if (result.state === 'prompt') {
//     showButtonToEnableMap();
//   }
//   // Don't do anything if the permission was denied.
// });

  await page.goto(url, {
    waitUntil: 'networkidle2',
  })

  // await page.waitFor(5000);

  const cars = await page.evaluate( () => {

    //page.waitFor(30000).then(() => {
      // 'div[data-qa="result-tile"]'
      const listing = document.querySelector('.list');
      console.info('results section ' + listing);
      let [...nodes] = listing.querySelectorAll('.search-results-inventory-card');
      console.info('found ' + nodes.length);
      return nodes.map(node => {
        // console.log('node')
        const title = node.querySelector('.text-gray-darker');
        const img = node.querySelector('img');
        let thumb = '';
        if (img) {
          // console.log('imgWrapper')
          // console.log(img);
          thumb = img.getAttribute('src');
          // console.log('thumb ' + thumb)
        }
        let cleanTitle = title.textContent;
        cleanTitle = cleanTitle.trim();
        return {title: cleanTitle, thumb}
      })//.filter(car => car.thumb !== null)
    //})


  });

  browser.close();

  return cars;
}

export default search;
