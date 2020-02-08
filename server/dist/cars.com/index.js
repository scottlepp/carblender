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
const mapping_1 = __importDefault(require("./mapping"));
const site = 'https://www.cars.com/for-sale/';
const searchUrl = `${site}searchresults.action/`;
const searchSuffix = '&page=1&perPage=20&searchSource=NEW_SEARCH&sort=relevance&stkTypId=28881';
const search = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({
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
    let url = searchUrl;
    let sep = '?';
    if (filters.make) {
        let param = mapping_1.default.query.make;
        let make = mapping_1.default.cars[filters.make];
        url += `${sep}${param}=${make.alias}`;
        sep = '&';
        if (filters.model) {
            param = mapping_1.default.query.model;
            let model = make.models[filters.model];
            url += `${sep}${param}=${model}`;
        }
    }
    url = url += searchSuffix;
    if (filters.price) {
        if (filters.price.min) {
            url += sep + 'prMn=' + filters.price.min;
        }
        if (filters.price.max) {
            url += sep + 'prMx=' + filters.price.max;
        }
        sep = '&';
    }
    console.log(url);
    yield page.goto(url, {
        waitUntil: 'networkidle2',
    });
    const cars = yield page.evaluate(() => {
        const listing = document.querySelector('#listings');
        let [...nodes] = listing.querySelectorAll('.shop-srp-listings__listing-container');
        console.log('found ' + nodes.length);
        return nodes.map(node => {
            // console.log('node')
            const title = node.querySelector('.listing-row__title');
            const imgWrapper = node.querySelector('.photo-scroll-wrapper');
            let thumb = '';
            if (imgWrapper) {
                // console.log('imgWrapper')
                const img = imgWrapper.childNodes[1];
                // console.log(img);
                thumb = img.getAttribute('style');
                // console.log('thumb ' + thumb)
                if (thumb) {
                    thumb = thumb.replace('background-image: url(', '');
                    thumb = thumb.replace(');', '');
                }
                else {
                    thumb = img.getAttribute('data-lazy-style');
                    if (thumb) {
                        thumb = thumb.replace('background-image: url(', '');
                        thumb = thumb.replace(');', '');
                    }
                }
            }
            let cleanTitle = title.textContent;
            cleanTitle = cleanTitle.trim();
            return { title: cleanTitle, thumb };
        }); //.filter(car => car.thumb !== null)
    });
    browser.close();
    return cars;
});
exports.default = search;
//# sourceMappingURL=index.js.map