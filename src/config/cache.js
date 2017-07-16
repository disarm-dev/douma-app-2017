export default {
  geodata: {
    // all_target_areas: null, // FeatureCollection
    // clusters: null // FeatureCollection
  },
  // form: {}, // DONE already gets added to instance_config


  location_selector: [], // should have config in instance_config, then create on the fly (and cache)
  aggregations: [], // index.js needs this
  presenters: [], // need to be converted, then index.js written, then it will need this
  validations: [], // index.js needs this
}
