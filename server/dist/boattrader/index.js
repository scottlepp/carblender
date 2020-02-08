"use strict";
// https://www.facebook.com/marketplace/search/?query=porsche%20panamera&vertical=C2C&sort=BEST_MATCH
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
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
// puppeteer.use(StealthPlugin())
const site = 'https://www.boattrader.com/boats/';
let searchUrl = `${site}`;
const searchSuffix = '';
const search = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_extra_1.default.launch({
        headless: false //change to true in prod!
    });
    let page = yield browser.newPage();
    page.on('console', msg => {
        const m = msg;
        for (let i = 0; i < m._args.length; ++i)
            console.log(`${i}: ${m._args[i]}`);
    });
    let url = searchUrl;
    let sep = '?';
    if (filters.make) {
        let make = filters.make;
        url += `/${filters.make}`;
        if (filters.model) {
            url += `/${filters.model}`;
        }
    }
    url = url += searchSuffix;
    if (filters.price) {
        if (filters.price.min) {
            url += sep + 'min_price=' + filters.price.min;
        }
        if (filters.price.max) {
            url += sep + 'max_price=' + filters.price.max;
        }
        sep = '&';
    }
    yield page.goto(url, {
        waitUntil: 'networkidle2',
    });
    // await page.waitFor(5000);
    // await page.setViewport({
    //   width: 1200,
    //   height: 800
    // });
    yield autoScroll(page);
    const cars = yield page.evaluate(() => {
        //page.waitFor(30000).then(() => {
        // 'div[data-qa="result-tile"]'
        const listing = document.querySelector('.boat-listings');
        if (listing) {
            console.info('results sectin ' + listing);
            let [...nodes] = listing.querySelectorAll('li');
            console.info('found ' + nodes.length);
            return nodes.map(node => {
                // console.log('node')
                const titleLink = node.querySelector('.main-link');
                if (titleLink) {
                    const img = node.querySelector('img');
                    let thumb = '';
                    if (img) {
                        // console.log('imgWrapper')
                        // console.log(img);
                        thumb = img.getAttribute('src');
                        // console.log('thumb ' + thumb)
                    }
                    const title = titleLink.childNodes[0];
                    return { title: title.textContent, thumb };
                }
            }).filter(car => car !== null);
        }
        else {
            return [];
        }
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