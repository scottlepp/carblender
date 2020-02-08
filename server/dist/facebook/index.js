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
// import mapping from './mapping';
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
puppeteer_extra_1.default.use(puppeteer_extra_plugin_stealth_1.default());
const site = 'https://www.facebook.com/';
const searchUrl = `${site}marketplace/category/vehicles/`;
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
        let param = 'vehicleMake';
        let make = filters.make;
        url += `${sep}${param}=${make}`;
        sep = '&';
        if (filters.model) {
            url += `${sep}vehicleModel=${filters.model}`;
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
    yield page.waitForSelector('div[data-testid="marketplace_category_feed"]', {
        timeout: 6000
    });
    const cars = yield page.evaluate(() => {
        //page.waitFor(30000).then(() => {
        // 'div[data-qa="result-tile"]'
        const listing = document.querySelector('div[data-testid="marketplace_category_feed"]');
        console.info('results sectin ' + listing);
        let [...nodes] = listing.querySelectorAll('a[data-testid="marketplace_feed_item"]');
        console.info('found ' + nodes.length);
        return nodes.map(node => {
            // console.log('node')
            const title = node.querySelector('#marketplace-modal-dialog-title');
            const img = node.querySelector('img');
            let thumb = '';
            if (img) {
                // console.log('imgWrapper')
                // console.log(img);
                thumb = img.getAttribute('src');
                // console.log('thumb ' + thumb)
            }
            let cleanTitle = title.getAttribute('title');
            cleanTitle = cleanTitle.trim();
            return { title: cleanTitle, thumb };
        }); //.filter(car => car.thumb !== null)
        //})
    });
    // browser.close();
    return cars;
});
exports.default = search;
//# sourceMappingURL=index.js.map