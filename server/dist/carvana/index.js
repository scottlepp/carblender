"use strict";
// https://www.carvana.com/cars/porsche-panamera/filters/?cvnaid=eyJmaWx0ZXJzIjp7InByaWNlIjp7Im1heCI6NTUwNTYsIm1pbiI6NjMwMH0sIm1vZGVsSWRzIjpbMjkxXX0sInNvcnRCeSI6Ik1vc3RQb3B1bGFyIn0%3D
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
//?dealerType=all&mdId=47843&mkId=20001&page=1&perPage=20&rd=20&searchSource=GN_REFINEMENT&sort=relevance&stkTypId=28881&zc=49348
// https://www.cars.com/for-sale/searchresults.action/
// ?mdId=30005&mkId=20081&page=1&perPage=20&rd=20&searchSource=NEW_SEARCH&sort=relevance&stkTypId=28881&zc=49348
// https://www.cars.com/for-sale/searchresults.action/?mkId=porsche&mdId=panamara&page=1&perPage=20&searchSource=NEW_SEARCH&sort=relevance&stkTypId=28881&zc=49348
// https://www.cars.com/for-sale/searchresults.action/?mdId=30005&mkId=20081&page=1&perPage=20&rd=20&searchSource=NEW_SEARCH&sort=relevance&stkTypId=28881&zc=49348
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
// import mapping from './mapping';
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
puppeteer_extra_1.default.use(puppeteer_extra_plugin_stealth_1.default());
const site = 'https://www.carvana.com/cars/porsche-panamera';
//const searchUrl = `${site}Used-`;
const searchUrl = site;
const searchSuffix = '';
const search = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_extra_1.default.launch({
        headless: true //change to true in prod!
    });
    let page = yield browser.newPage();
    page.on('console', msg => {
        const m = msg;
        for (let i = 0; i < m._args.length; ++i)
            console.log(`${i}: ${m._args[i]}`);
    });
    // workaround bot detection
    yield page.setExtraHTTPHeaders({
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
    });
    yield page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
    // Pass the User-Agent Test.
    //   const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
    //   'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    //   await page.setUserAgent(userAgent);
    //   // Pass the Webdriver Test.
    //   await page.evaluateOnNewDocument(() => {
    //     Object.defineProperty(navigator, 'webdriver', {
    //       get: () => false,
    //     });
    //   });
    //   // Pass the Chrome Test.
    //   await page.evaluateOnNewDocument(() => {
    //     const navigator:any = window.navigator;
    //     // We can mock this in as much depth as we need for the test.
    //     navigator.chrome = {
    //       runtime: {},
    //       // etc.
    //     };
    //   });
    // // Pass the Permissions Test.
    // await page.evaluateOnNewDocument(() => {
    //   const navigator:any = window.navigator;
    //   const originalQuery = window.navigator.permissions.query;
    //   return navigator.permissions.query = (parameters) => (
    //     parameters.name === 'notifications' ?
    //       Promise.resolve({ state: Notification.permission }) :
    //       originalQuery(parameters)
    //   );
    // });
    // // Pass the Plugins Length Test.
    // await page.evaluateOnNewDocument(() => {
    //   // Overwrite the `plugins` property to use a custom getter.
    //   Object.defineProperty(navigator, 'plugins', {
    //     // This just needs to have `length > 0` for the current test,
    //     // but we could mock the plugins too if necessary.
    //     get: () => [1, 2, 3, 4, 5],
    //   });
    // });
    // // Pass the Languages Test.
    // await page.evaluateOnNewDocument(() => {
    //   // Overwrite the `plugins` property to use a custom getter.
    //   Object.defineProperty(navigator, 'languages', {
    //     get: () => ['en-US', 'en'],
    //   });
    // });
    let url = searchUrl;
    yield page.goto(url, {
        waitUntil: 'networkidle2',
    });
    // await page.waitFor(5000);
    yield page.setViewport({
        width: 1200,
        height: 800
    });
    yield autoScroll(page);
    const cars = yield page.evaluate(() => {
        //page.waitFor(30000).then(() => {
        const listing = document.querySelector('#results-secton');
        console.log('results sectin ' + listing);
        let [...nodes] = listing.querySelectorAll('div[data-qa="result-tile"]');
        console.log('found ' + nodes.length);
        return nodes.map(node => {
            // console.log('node')
            const title = node.querySelector('.vehicle-make');
            const img = node.querySelector('div[data-qa="image"]');
            let thumb = '';
            if (img) {
                // console.log('imgWrapper')
                // console.log(img);
                thumb = img.getAttribute('src');
                // console.log('thumb ' + thumb)
            }
            let cleanTitle = title.textContent;
            cleanTitle = cleanTitle.trim();
            return { title: cleanTitle, thumb };
        }); //.filter(car => car.thumb !== null)
        //})
    });
    browser.close();
    return cars;
});
exports.default = search;
// image links aren't populated until scrolling into view
function autoScroll(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.evaluate(() => {
            return new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 100;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 10);
            });
        });
    });
}
//# sourceMappingURL=index.js.map