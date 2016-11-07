import turf from 'turf'

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
    // create convex hull
    const hull = turf.convex(this.centroids)
    const bufferedHull = turf.buffer(hull, 200, 'metres')
    return bufferedHull
  }

}
