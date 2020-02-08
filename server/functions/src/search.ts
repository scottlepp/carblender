import cargurus from './cargurus/index';

export async function search(filters: any) {
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
  return cars;
}