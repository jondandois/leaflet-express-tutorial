/* 
    API helpers
*/

module.exports = {
  getAllFeaturesQuery(featureClass, limit = 0){
    var limitQuery = limit === 0 ? '' : `limit ${limit}`;  
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
      FROM (SELECT * FROM public.${featureClass} ${limitQuery}) inputs) features
    `;
    return query
  },
  handleQueryErrors(err, res){
    let status = 500;
    res.locals.message = "Something went wrong"
    res.locals.error = err;
    res.locals.error.status = status;
    return res.status(status).json({"message": "There was a problem communicating with the server"});
  }
}
