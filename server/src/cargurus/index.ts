//https://www.edmunds.com/inventory/srp.html?inventorytype=used%2Ccpo&make=porsche&model=panamera&price=25000-50000

import puppeteer from 'puppeteer-extra';
// import puppeteer from 'puppeteer';
// import mapping from './mapping';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// stealth doesn't work on edmunds
puppeteer.use(StealthPlugin())

//https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?zip=49344&maxPrice=106000&showNegotiable=true&sourceContext=untrackedWithinSite_false_0&distance=100&minPrice=41000&entitySelectingHelper.selectedEntity=m19

const site = 'https://www.edmunds.com/';
//const searchUrl = `https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?sourceContext=carGurusHomePageModel&entitySelectingHelper.selectedEntity=d1037&zip=49344`;
const searchUrl = `https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?zip=49344&distance=100`;

const searchSuffix = '';

const search = async (filters) => {
  console.log('launching browser');
  let browser;
  try {
    browser = await puppeteer.launch(
      {
        headless: true,  //change to true in prod!
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    )
  } catch (e) {
    console.log('failed to launch', e);
    return [];
  }

  let url = searchUrl;
  let sep = '&';
  // if (filters.make) {
  //   let param = 'make';
  //   let make = filters.make;
  //   url += `${sep}${param}=${make}`;
  //   sep = '&';
  //   if (filters.model) {
  //     param = 'model';
  //     url += `${sep}${param}=${filters.model}`;
  //   }
  // }
  // url = url += searchSuffix;
  if (filters.price) {
    if (filters.price.min) {
      url += sep + 'minPrice=' + filters.price.min
    }
    if (filters.price.max) {
      url += sep + 'maxPrice=' + filters.price.max
    }
    sep = '&';
  }

  // const urlObj = new URL(url);

  // const context = browser.defaultBrowserContext();
  // context.clearPermissionOverrides();
  // context.overridePermissions(urlObj.origin, ['geolocation']);

  console.log('openeing new page');
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

console.log('opening url ' + url);

  await page.goto(url, {
    waitUntil: 'networkidle2',
  })

console.log('opened url ' + url);

  if (filters.make) {

    // get the value of the drop down by text
    const key = await page.evaluate((filters) => {
      const select:any = document.querySelector('#cargurus-desktop-new-search-form-car-make');
      const [...options] = select.options;
      const opt = options.find(o => o.text.toLowerCase() === filters.make.toLowerCase());
      return opt.value;
    }, filters);
  
    let entity = key;
  
    // select the car we want
    await page.select('#cargurus-desktop-new-search-form-car-make', key)
  
    if (filters.model) {
      // get the value of the drop down by text
      const model = await page.evaluate((filters) => {
        const select:any = document.querySelector('#cargurus-desktop-new-search-form-car-model');
        const [...options] = select.options;
        const opt = options.find(o => o.text.toLowerCase() === filters.model.toLowerCase());
        return opt.value;
      }, filters);
    
      // select the car we want
      // await page.select('#cargurus-desktop-new-search-form-car-model', model)
      entity = model;
    }

    url += `&entitySelectingHelper.selectedEntity=${entity}`;

    // // submit the search
    // const searchButton = await page.$('button[type="submit"]');
    // await searchButton.click();
  
    // // wait for results
    // await page.waitForSelector('div[data-cg-ft="srp-all-listing-blades"]');

    await page.goto(url, {
      waitUntil: 'networkidle2',
    })
  }


  console.log('getting cars');

  // get results
  const cars = await page.evaluate(() => {
    const [...alerts] = document.querySelectorAll('strong');
    const noResults = alerts.find(a => a.textContent === 'Sorry');
    if (noResults !== undefined) {
      return [];
    }

    const listing = document.querySelector('div[data-cg-ft="srp-all-listing-blades"]');
    console.info('results section ' + listing);
    let [...nodes] = listing.querySelectorAll('.SimGDW');
    console.info('found ' + nodes.length);
    return nodes.map(node => {
      // console.log('node')
      const title = node.querySelector('span');
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
  });

  console.log('got cars ' + cars.length);

  browser.close();

  return cars;
}

export default search;
