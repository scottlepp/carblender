import express from "express";
import { search } from './search';

const app = express();

const cors = require('cors')({origin: true});

app.use(cors);

app.get('/foo', (req, res) => {
  res.json({foo: 'bar'});
});

app.get('/api', (req, res) => {

  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');

  const filters = {
    make: undefined,
    model: undefined,
    // price: {
    //   min: 10000,
    //   max: 40000
    // }
  }
  const params = req.query;
  if (params.make) {
    filters.make = params.make;
    if (params.model) {
      filters.model = params.model;
    }
    if (params.pmin || params.pmax) {
      const price = {
        min: params.pmin,
        max: params.pmax
      }
      Object.assign(filters, price);
    }
  }

  search(filters).then(cars => {
    res.json(cars);
  }).catch(() => 'search failed');
});

app.listen(80, () => console.log(`app listening on port ${80}!`))