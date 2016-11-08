import turf from 'turf'
import geoCoords from 'geojson-coords'

export class MapSupport {

  constructor (polygonsFeatureCollection) {
    this.polygons = polygonsFeatureCollection
    this.centroids = this.convertPolygonsToCentroids()
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
    const caseCentroids = this.centroids.features.filter((i) => i.properties.casePresent)
    const caseCentroidsFeatureCollection = {
      type: 'FeatureCollection', 
      features: caseCentroids
    }
    const hull = turf.convex(caseCentroidsFeatureCollection)
    const bufferedHull = turf.buffer(hull, 15, 'metres')

    const simplified = this.simplifyPolygon(geoCoords(hull))

    return hull
  }

  // TODO: Simplify polygon, so it is easier to edit in guessFociBoundary instead
  simplifyPolygon(coords) {
    return turf.simplify(coords, 5, true);
  }

}
