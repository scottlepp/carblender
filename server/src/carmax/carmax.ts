import puppeteer from 'puppeteer';

const search = async (filters) => {
  const browser = await puppeteer.launch(
    {
      headless: true  //change to true in prod!
    }
  )
  let page = await browser.newPage()

  // workaround bot detection
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
  });

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')

  let url = 'https://www.carmax.com/cars';
  if (filters.make) {
    url += '/' + filters.make;
    if (filters.model) {
      url += '/' + filters.model
    }
  }
  let sep = '?';
  if (filters.price) {
    url += sep + 'price=' + filters.price.min + '-' + filters.price.max
    sep = '&';
  }

  await page.goto(url, {
    waitUntil: 'networkidle2',
  })

  // const content = await page.content();

  // await page.waitForSelector('.car-tile');

  const cars = await page.evaluate(() => {
    const listing = document.querySelector('#listing');
    let [...nodes] = listing.querySelectorAll('.car-tile');
    return nodes.map(node => {
      const title = node.querySelector('.car-title');
      const imgWrapper = node.querySelector('.img-wrapper');
      let thumb = '';
      if (imgWrapper) {
        const img = imgWrapper.childNodes[0];
        thumb = img.getAttribute('src');
      }
      return {title: title.textContent, thumb}
    }).filter(car => car.thumb !== null)
  });

  // const cars = await page.$$eval('#listing', listing => {
  //   const nodes = listing[0].querySelectorAll('.car-tile');
  //   return nodes;
  //   // return nodes.map(node => {
  //   //   const title = node.querySelector('.car-title');
  //   //   // const thumbElement = node.querySelector('.img-wrapper');
  //   //   // console.log(thumbElement);
  //   //   // const thumb = thumbElement.getAttribute('src');
  //   //   const imgWrapper = node.querySelector('.img-wrapper');
  //   //   let thumb = '';
  //   //   if (imgWrapper) {
  //   //     const img = imgWrapper.childNodes[0];
  //   //     thumb = img.getAttribute('src');
  //   //   }
  //   //   return {title: title.textContent, thumb}
  //   // })
  // });

  // const cars = await page.$$eval('.car-tile', nodes => {
  //   return nodes.map(node => {
  //     const title = node.querySelector('.car-title');
  //     // const thumbElement = node.querySelector('.img-wrapper');
  //     // console.log(thumbElement);
  //     // const thumb = thumbElement.getAttribute('src');
  //     const imgWrapper = node.querySelector('.img-wrapper');
  //     let thumb = '';
  //     if (imgWrapper) {
  //       const img = imgWrapper.childNodes[0];
  //       thumb = img.getAttribute('src');
  //     }
  //     return {title: title.textContent, thumb}
  //   })
  // });
  // console.log(cars);

  browser.close();

  return cars;
}

export default search
