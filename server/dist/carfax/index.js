"use strict";
// https://www.cars.com/for-sale/searchresults.action/
//?dealerType=all&mdId=47843&mkId=20001&page=1&perPage=20&rd=20&searchSource=GN_REFINEMENT&sort=relevance&stkTypId=28881&zc=49348
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://www.cars.com/for-sale/searchresults.action/
// ?mdId=30005&mkId=20081&page=1&perPage=20&rd=20&searchSource=NEW_SEARCH&sort=relevance&stkTypId=28881&zc=49348
// https://www.cars.com/for-sale/searchresults.action/?mkId=porsche&mdId=panamara&page=1&perPage=20&searchSource=NEW_SEARCH&sort=relevance&stkTypId=28881&zc=49348
// https://www.cars.com/for-sale/searchresults.action/?mdId=30005&mkId=20081&page=1&perPage=20&rd=20&searchSource=NEW_SEARCH&sort=relevance&stkTypId=28881&zc=49348
const puppeteer_1 = __importDefault(require("puppeteer"));
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// puppeteer.use(StealthPlugin())
const site = 'https://www.carfax.com/cars-for-sale';
//const searchUrl = `${site}Used-`;
const searchUrl = site;
const searchSuffix = '';
const search = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({
        headless: false //change to true in prod!
    });
    let page = yield browser.newPage();
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
    yield page.setUserAgent(userAgent);
    // Pass the Webdriver Test.
    yield page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => false,
        });
    });
    // Pass the Chrome Test.
    yield page.evaluateOnNewDocument(() => {
        const navigator = window.navigator;
        // We can mock this in as much depth as we need for the test.
        navigator.chrome = {
            runtime: {},
        };
    });
    // Pass the Permissions Test.
    yield page.evaluateOnNewDocument(() => {
        const navigator = window.navigator;
        const originalQuery = window.navigator.permissions.query;
        return navigator.permissions.query = (parameters) => (parameters.name === 'notifications' ?
            Promise.resolve({ state: Notification.permission }) :
            originalQuery(parameters));
    });
    // Pass the Plugins Length Test.
    yield page.evaluateOnNewDocument(() => {
        // Overwrite the `plugins` property to use a custom getter.
        Object.defineProperty(navigator, 'plugins', {
            // This just needs to have `length > 0` for the current test,
            // but we could mock the plugins too if necessary.
            get: () => [1, 2, 3, 4, 5],
        });
    });
    // Pass the Languages Test.
    yield page.evaluateOnNewDocument(() => {
        // Overwrite the `plugins` property to use a custom getter.
        Object.defineProperty(navigator, 'languages', {
            get: () => ['en-US', 'en'],
        });
    });
    let url = searchUrl;
    yield page.goto(url, {
        waitUntil: 'networkidle2',
    });
    const cars = yield page.evaluate(() => __awaiter(void 0, void 0, void 0, function* () {
        // const option = (await page.$x(
        //   '//*[@ = "selectId"]/option[text() = "Audi"]'
        // ))[0];
        // await page.select("select.search-make", "Porsche")
        yield page.waitFor(30000);
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
    }));
    browser.close();
    return cars;
});
exports.default = search;
//# sourceMappingURL=index.js.map