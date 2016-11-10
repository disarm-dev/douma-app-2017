export function firebaseObjectToArray (data) {
  // data is an "object of objects"
  // MUST HAVE an INTEGER as the key
  let output = []
  for (const key in data) {
      // skip loop if the property is from prototype
      if (!data.hasOwnProperty(key)) continue
      output.push({...data[key], id: parseInt(key)})
  }
  return output
}

// TODO: Do we need our own implementation of this?!
export function buildFeatureCollection (array) {
  let output = {
    type: "FeatureCollection",
    features: []
  }

  output.features = array.map((i, index) => {
    let obj = { type: 'Feature', properties: {} }
    obj.properties.id = i.id
    // TODO: Remove this `casePresent` for-debugging-only property
    obj.properties.casePresent = Math.random() >= 0.5 // random boolean, was `!!(i.actioned)`
    obj.geometry = i.geometry
    return obj
  })

  return output
}



