// https://muskegon.craigslist.org/
// search/cta?search_distance=4000&postal=49344&min_price=5000&max_price=40000&auto_make_model=porsche+cayman

import puppeteer from 'puppeteer-extra';
// import mapping from './mapping';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin())

const site = 'https://muskegon.craigslist.org/';
const searchUrl = `${site}search/cta`;
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
    let param = 'auto_make_model';
    let make = filters.make;
    url += `${sep}${param}=${make}`;
    sep = '&';
    if (filters.model) {
      url += `+${filters.model}`;
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

  const cars = await page.evaluate( () => {

    //page.waitFor(30000).then(() => {

      const listing = document.querySelector('.rows');
      console.log('results sectin ' + listing);
      let [...nodes] = listing.querySelectorAll('.result-row');
      console.log('found ' + nodes.length);
      return nodes.map(node => {
        // console.log('node')
        const title = node.querySelector('.result-title');
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
