
const remove_properties = (feature_collection) => {
  return feature_collection.features.map((feature) => {
    return {
      geometry: feature.geometry,
      type: feature.type,
      properties: {}
    }
  })
}

export {remove_properties}