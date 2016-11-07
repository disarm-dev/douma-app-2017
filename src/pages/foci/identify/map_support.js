import Turf from 'turf'
import structures from './temp_structures.js'

export class MapSupport {

  constructor (data) {
    this.data = data
    this.featureCollection = this.buildFeatureCollection(data)
  }

  // Create FeatureCollection from firebase export of structures.
  buildFeatureCollection (data) {
    let output = {
      type: "FeatureCollection",
      features: []
    }

    for (const key in data) {
        // skip loop if the property is from prototype
        if (!data.hasOwnProperty(key)) continue

        let obj = { type: 'Feature', properties: {} }
        obj.geometry = data[key].geometry
        obj.properties.id = key
        output.features.push(obj)
    }

    return output
  }

  guessFoci () {
    return this.structures
  }

  plotFociGuess (map) {

  }

}


// TODO: Remove global debug stuff - it's horrible!
let m = new MapSupport(structures)

window.Turf = Turf
window.MapSupport = MapSupport
window.m = m
