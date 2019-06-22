/* PostgreSQL and PostGIS module and connection setup */
require('dotenv').config();
var database_url = process.env.DATABASE_URL;

// Setup
var ApiHelpers = require('./api-helpers.js')
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
  var query = ApiHelpers.getAllFeaturesQuery('atlas_index'); 
  pool.query(query, (err, results) => {
    if (err) {
      return ApiHelpers.handleQueryErrors(err, res);
    }
    res.status(200).json(results.rows[0]['jsonb_build_object'])
  })
});

module.exports = router;
