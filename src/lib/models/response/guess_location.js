import {get} from 'lodash'
import cache from 'config/cache'
import {get_planning_level_name} from "lib/instance_data/spatial_hierarchy_helper"
import {featureCollection, point} from '@turf/helpers'
import bounding_box from '@turf/bbox'
import rbush from 'rbush'
import within from '@turf/boolean-within'

export function guess_location_for(responses) {
  console.time('index')
  const planning_level_name = get_planning_level_name()
  const planning_level_fc = cache.geodata[planning_level_name]
  const area_features = planning_level_fc.features
  const bboxes = area_features.map(f => {
    return bbox_and_id(f, '__disarm_geo_id')
  })
  

  const tree = rbush()
  tree.load(bboxes)
  console.timeEnd('index')
  window.tree = tree


  return responses.map(r => {
    if (!get(r, 'location.selection.id', false)) {
      // fix here
      const response_point = point([r.location.coords.longitude, r.location.coords.latitude])
      const coords_bbox = bbox_and_id(response_point, '__disarm_geo_id')
      const result = tree.search(coords_bbox)

      if (result.length) {
        console.log(result.length)
        const features_from_search = result.filter(res => {
          return within(res.feature, response_point)
        })

        console.log('features_from_search', features_from_search)


        const names = features_from_search.map(f => {
          return get(f, 'properties.__disarm_geo_name', '')
        })
        // console.log('searching for', get(r, 'location.selection.name', ''), 'found', names)

        // add location.selection to record here
      }

    }

    return r
  })
}

function bbox_and_id(feature, field) {
  const bbox = bounding_box(feature.geometry)
  return {
    id: feature.properties[field],
    minX: bbox[0],
    minY: bbox[1],
    maxX: bbox[2],
    maxY: bbox[3],
    feature
  }
}

window.bbox_and_id = bbox_and_id