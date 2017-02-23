import union from '@turf/union'
import clone from 'clone'

const merge = (feature_collection) => {
  var merged = clone(feature_collection.features[0]), features = feature_collection.features, broken = []
  for (var i = 0, len = features.length; i < len; i++) {
    var poly = features[i];
    if (poly.geometry) {
      try {
        merged = union(merged, poly)
      }
      catch(e) {
        broken.push(poly)
      }
    }
  }
  return {
    type: 'FeatureCollection',
    features: broken.concat(merged)
  }
}

const remove_properties = (feature_collection) => {
  feature_collection.features = feature_collection.features.map((feature) => {
    return {
      geometry: feature.geometry,
      type: feature.type,
      properties: {}
    }
  })
  return feature_collection
}

export {merge, remove_properties}
