import carmax from './carmax/carmax'
import cars_com from './cars.com/index';
import carfax from './carfax/index';
import carvana from './carvana/index';
import craigslist from './craigslist/index';
import facebook from './facebook/index';
import edmunds from './edmunds/index';
import cargurus from './cargurus/index';
import autotrader from './autotrader';
import boattrader from './boattrader';

const filters = {
  make: 'porsche',
  model: 'panamera',
  price: {
    min: 10000,
    max: 40000
  }
}

export async function search(filters) {
  // const cars = await carmax(filters);
  // const cars = await cars_com(filters);
  // const cars = await carvana(filters);
  // const cars = await craigslist(filters);
  // const cars = await edmunds(filters);
  const cars = await cargurus(filters);
  // const cars = await autotrader({});
  // const cars = await boattrader({});
  // const cars = await facebook(filters);
  console.log(cars);
}