
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

export {remove_properties}