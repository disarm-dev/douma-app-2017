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




