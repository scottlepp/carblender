"use strict";
//https://www.edmunds.com/inventory/srp.html?inventorytype=used%2Ccpo&make=porsche&model=panamera&price=25000-50000
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
// import puppeteer from 'puppeteer';
// import mapping from './mapping';
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
// stealth doesn't work on edmunds
puppeteer_extra_1.default.use(puppeteer_extra_plugin_stealth_1.default());
//https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?zip=49344&maxPrice=106000&showNegotiable=true&sourceContext=untrackedWithinSite_false_0&distance=100&minPrice=41000&entitySelectingHelper.selectedEntity=m19
const site = 'https://www.edmunds.com/';
//const searchUrl = `https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?sourceContext=carGurusHomePageModel&entitySelectingHelper.selectedEntity=d1037&zip=49344`;
const searchUrl = `https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?zip=49344&distance=100`;
const searchSuffix = '';
const search = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_extra_1.default.launch({
        headless: false //change to true in prod!
    });
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
            url += sep + 'minPrice=' + filters.price.min;
        }
        if (filters.price.max) {
            url += sep + 'maxPrice=' + filters.price.max;
        }
        sep = '&';
    }
    // const urlObj = new URL(url);
    // const context = browser.defaultBrowserContext();
    // context.clearPermissionOverrides();
    // context.overridePermissions(urlObj.origin, ['geolocation']);
    let page = yield browser.newPage();
    page.on('console', msg => {
        const m = msg;
        for (let i = 0; i < m._args.length; ++i)
            console.log(`${i}: ${m._args[i]}`);
    });
    yield page.setExtraHTTPHeaders({
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
    });
    // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')
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
    yield page.goto(url, {
        waitUntil: 'networkidle2',
    });
    if (filters.make) {
        // get the value of the drop down by text
        const key = yield page.evaluate((filters) => {
            const select = document.querySelector('#cargurus-desktop-new-search-form-car-make');
            const [...options] = select.options;
            const opt = options.find(o => o.text.toLowerCase() === filters.make.toLowerCase());
            return opt.value;
        }, filters);
        let entity = key;
        // select the car we want
        yield page.select('#cargurus-desktop-new-search-form-car-make', key);
        if (filters.model) {
            // get the value of the drop down by text
            const model = yield page.evaluate((filters) => {
                const select = document.querySelector('#cargurus-desktop-new-search-form-car-model');
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
        yield page.goto(url, {
            waitUntil: 'networkidle2',
        });
    }
    // get results
    const cars = yield page.evaluate(() => {
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
            return { title: cleanTitle, thumb };
        }); //.filter(car => car.thumb !== null)
    });
    // browser.close();
    return cars;
});
exports.default = search;
//# sourceMappingURL=index.js.map