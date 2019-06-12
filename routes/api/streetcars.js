/* PostgreSQL and PostGIS module and connection setup */
require('dotenv').config();
var database_url = process.env.DATABASE_URL;

// Setup
const express = require('express');
var router = express.Router();

const Pool = require('pg').Pool;
const pool = new Pool({
  connectionString: database_url,
  ssl: true
});

//   GET
// https://www.youtube.com/watch?v=j55fHUJqtyw
router.get('/', (req, res) => {
  var query = `
      SELECT jsonb_build_object(
          'type',     'FeatureCollection',
          'features', jsonb_agg(features.feature)
      )
      FROM (
      SELECT jsonb_build_object(
          'type',       'Feature',
          'id',         id,
          'geometry',   ST_AsGeoJSON(ST_Transform(geom, 4326))::jsonb,
          'properties', to_jsonb(inputs) - 'geom'
      ) AS feature
      FROM (SELECT * FROM public.streetcars limit 1000) inputs) features
    `;
  pool.query(query, (err, results, next) => {
    if (err) {
      let status = 500;
      res.locals.message = "Something went wrong"
      res.locals.error = err;
      res.locals.error.status = status;
      res.status(status);
      return res.status(500).json({"message": "There was a problem communicating with the server"});
    }
    res.status(200).json(results.rows[0]['jsonb_build_object'])
  })
});

module.exports = router;
