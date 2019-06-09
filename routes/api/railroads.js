/* PostgreSQL and PostGIS module and connection setup */
require('dotenv').config();
var username = process.env.DB_USERNAME;
var password = process.env.DB_PASSWORD;
var host = process.env.DB_HOST;
var port = process.env.DB_PORT;
var database = process.env.DB;

// Setup
const express = require('express');
const fs = require('fs');
const Pool = require('pg').Pool;
const pool = new Pool({
  user: username,
  password: password,
  host: host,
  port: port,
  database: database,
  ssl: {
    ca: fs.readFileSync("config/amazon-rds-ca-cert.pem").toString()
  }
});
var router = express.Router();

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
          'id',         gid,
          'geometry',   ST_AsGeoJSON(geom)::jsonb,
          'properties', to_jsonb(inputs) - 'gid' - 'geom'
      ) AS feature
      FROM (SELECT * FROM public.railroads limit 1000) inputs) features
    `;
  pool.query(query, (err, results, next) => {
    console.log(err)
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
