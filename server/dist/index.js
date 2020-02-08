"use strict";
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
const index_1 = __importDefault(require("./cargurus/index"));
const filters = {
    make: 'porsche',
    model: 'panamera',
    price: {
        min: 10000,
        max: 40000
    }
};
function search(filters) {
    return __awaiter(this, void 0, void 0, function* () {
        // const cars = await carmax(filters);
        // const cars = await cars_com(filters);
        // const cars = await carvana(filters);
        // const cars = await craigslist(filters);
        // const cars = await edmunds(filters);
        const cars = yield index_1.default(filters);
        // const cars = await autotrader({});
        // const cars = await boattrader({});
        // const cars = await facebook(filters);
        console.log(cars);
    });
}
search(filters);
//# sourceMappingURL=index.js.map