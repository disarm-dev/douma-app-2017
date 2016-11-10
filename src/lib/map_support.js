import turf from 'turf'
import geoCoords from 'geojson-coords'

export class MapSupport {

  // Doesn't retunr a FeatureCollection, just the instance.

  constructor (polygonsFeatureCollection) {
    this.polygons = polygonsFeatureCollection
    // this.centroids = this.convertPolygonsToCentroids()
    return this
  }

  convertPolygonsToCentroids () {
    const centroids = this.polygons.features.map((polygon) => {
      const centroidFeature = turf.centroid(polygon)
      centroidFeature.properties = polygon.properties
      return centroidFeature
    })
    return turf.featureCollection(centroids)
  }

  guessFociBoundary () {
    // Returns a FeatureCollection
    // create convex hull
    const caseCentroids = this.convertPolygonsToCentroids().features.filter((i) => i.properties.casePresent)
    const caseCentroidsFeatureCollection = {
      type: 'FeatureCollection', 
      features: caseCentroids
    }
    const hull = turf.convex(caseCentroidsFeatureCollection)
    const bufferedHull = turf.buffer(hull, 15, 'metres')

    // const simplified = this.simplifyPolygon(geoCoords(bufferedHull))

    return bufferedHull
  }

  // TODO: Simplify polygon, so it is easier to edit in guessFociBoundary instead
  // simplifyPolygon(coords) {
  //   return {
  //     type: 'FeatureCollection',
  //     features: [
  //       {
  //         "type": "Feature",
  //         "properties": {},
  //         "geometry": {
  //           "type": "Polygon",
  //           "coordinates": turf.simplify(coords, 5, true)
  //         }
  //       }
  //     ]
  //   }    
  // }

}
