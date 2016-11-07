import turf from 'turf'

export class MapSupport {

  constructor (polygonsFeatureCollection) {
    this.polygonsFeatureCollection = polygonsFeatureCollection
    this.centroids = this.convertPolygonsToCentroids()
    debugger
    // this.featureCollection = this.buildFeatureCollection(data)
  }


  convertPolygonsToCentroids () {
    const centroids = this.polygonsFeatureCollection.features.map((polygon) => {
      return turf.centroid(polygon)
    })
    return turf.featureCollection(centroids)
  }


  // Create FeatureCollection from firebase export of structures.

  guessFociBoundary () {
    // create convex hull
    const hull = turf.convex(this.featureCollection)

    const resultFeatures = points.features.concat(hull)
    const result = {
      "type": "FeatureCollection",
      "features": resultFeatures
    }

    return hull
  }

}
