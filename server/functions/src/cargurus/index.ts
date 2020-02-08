import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin())

const searchUrl = `https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?zip=49344&distance=100`;

const search = async (filters) => {
  const browser = await puppeteer.launch(
    {
      headless: true  //change to true in prod!
    }
  )

  let url = searchUrl;
  let sep = '&';

  if (filters.price) {
    if (filters.price.min) {
      url += sep + 'minPrice=' + filters.price.min
    }
    if (filters.price.max) {
      url += sep + 'maxPrice=' + filters.price.max
    }
    sep = '&';
  }

  console.log('creating browser page');

  const page = await browser.newPage()

  page.on('console', msg => {
    const m:any = msg;
    for (let i = 0; i < m._args.length; ++i)
        console.log(`${i}: ${m._args[i]}`);
    });


  console.log('going to url: ' + url);
  await page.goto(url, {
    waitUntil: 'networkidle2',
  })

  console.log('checking filters');
  if (filters.make) {

    console.log('getting make from dropdown');
    // get the value of the drop down by text
    const key = await page.evaluate((f) => {
      const select:any = document.querySelector('#cargurus-desktop-new-search-form-car-make');
      const [...options] = select.options;
      const opt = options.find(o => o.text.toLowerCase() === f.make.toLowerCase());
      return opt.value;
    }, filters);
  
    let entity = key;
  
    console.log('selecting make');
    // select the car we want
    await page.select('#cargurus-desktop-new-search-form-car-make', key)
  
    if (filters.model) {
      console.log('getting model from drop down');
      // get the value of the drop down by text
      const model = await page.evaluate((f) => {
        const select:any = document.querySelector('#cargurus-desktop-new-search-form-car-model');
        const [...options] = select.options;
        const opt = options.find(o => o.text.toLowerCase() === f.model.toLowerCase());
        return opt.value;
      }, filters);

      entity = model;
    }

    url += `&entitySelectingHelper.selectedEntity=${entity}`;

    console.log('going to url: ' + url);

    await page.goto(url, {
      waitUntil: 'networkidle2',
    })
  }

  // get results
  const cars = await page.evaluate(() => {
    const [...alerts] = document.querySelectorAll('strong');
    const noResults = alerts.find(a => a.textContent === 'Sorry');
    if (noResults !== undefined) {
      return [];
    }

    const listing = document.querySelector('div[data-cg-ft="srp-all-listing-blades"]');
    console.info('results section ' + listing);
    const [...nodes] = listing.querySelectorAll('.SimGDW');
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

  await browser.close();

  return cars;
}

export default search;
