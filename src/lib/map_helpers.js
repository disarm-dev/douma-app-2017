import turf from 'turf'
import geoCoords from 'geojson-coords'

export default {
  buildFeatureCollection (array) {
    // Takes array of geometries from firebase
    let output = {
      type: "FeatureCollection",
      features: []
    }

    output.features = array.map((i, index) => {
      let obj = { type: 'Feature', properties: i, geometry: i.geometry }

      // Remove duplicate
      delete obj.properties.geometry

      // TODO: Remove this `casePresent` for-debugging-only property
      obj.properties.casePresent = Math.random() >= 0.5 // random boolean, was `!!(i.actioned)`

      return obj
    })

    // Returns a FeatureCollection
    return output 
  },
  // Doesn't return a FeatureCollection, just the instance.
  convertPolygonsToCentroids (polygons) {
    // Takes array of polygons
    const centroids = polygons.features.map((polygon) => {
      const centroidFeature = turf.centroid(polygon)
      centroidFeature.properties = polygon.properties
      return centroidFeature
    })

    // Returns FeatureCollection of centroids
    return turf.featureCollection(centroids) 
  },

  guessFociBoundary (structuresFc) {
    // Returns a FeatureCollection
    // create convex hull
    const caseCentroids = this.convertPolygonsToCentroids(structuresFc).features.filter((i) => i.properties.casePresent)
    const caseCentroidsFeatureCollection = {
      type: 'FeatureCollection', 
      features: caseCentroids
    }
    const hull = turf.convex(caseCentroidsFeatureCollection)
    // const bufferedHull = turf.buffer(hull, 15, 'metres')

    // const simplified = this.simplifyPolygon(geoCoords(bufferedHull))

    return hull
  },
}
