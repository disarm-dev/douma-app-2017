import turf from '@turf/turf'
import turfHelpers from '@turf/helpers'
import clone from 'clone'
import union from '@turf/union'


const merge_polygons = (polygons_array) => {
  const just_geoms = polygons_array.map((l) => {
    return { geometry: l.geometry, type: l.type, properties: {} }
  })
  const polygons_to_merge = turfHelpers.featureCollection(just_geoms)

  // From Turf CHANGELOG for v3.0.1 (https://github.com/Turfjs/turf/blob/master/CHANGELOG.md)
  var merged = clone(polygons_to_merge.features[0]), features = polygons_to_merge.features;
  for (var i = 0, len = features.length; i < len; i++) {
    var poly = features[i]
    if (!poly.geometry) return
    try {
      merged = union(merged, poly)
    }
    catch (e) {
      // console.log('Failed for', poly, 'with', e)
    }
  }

  let polygons = turfHelpers.featureCollection(merged)
  // TODO: @refac Make sure API can accept `features` as a single object as well as an array
  // Create FeatureCollection by hand to ensure 'features' stays an array - required by the API?
  return polygons.features = [polygons.features]
}


export default merge_polygons
