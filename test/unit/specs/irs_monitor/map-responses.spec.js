import get_data from 'apps/irs_monitor/lib/get_data_for_viz'
import {featureCollection} from '@turf/helpers'
import {uniq} from 'lodash'
import cache from 'config/cache'

describe('responses displayed on map', () => {
  // Input for get_data
  const responses = [
    {
      instance_slug: 'test_instance',
      username: 'test_user',

      id: 'id',
      userAgent: 'chrome',
      recorded_on: "today",

      form_data: {},
      location: {
        coords: {
          latitude: 24,
          longitude: 31,
          accuracy: 10
        },
        selection: {
          id: "1",
          name: "location 1"
        }
      }
    },
    {
      instance_slug: 'test_instance',
      username: 'test_user',

      id: 'id',
      userAgent: 'chrome',
      recorded_on: "today",

      form_data: {},
      location: {
        coords: {
          latitude: 24,
          longitude: 31,
          accuracy: 10
        },
        selection: {
          name: "location 1",
          id: "1"
        }
      }
    }
  ]

  const targets = [{
    area_id: 'id1',
    team_name: 'team 1'
  }, {
    area_id: 'id2',
    team_name: 'team 1'
  }]

  const aggregations = [{
    "name": "homesteads found",
    "numerator_expr": "1"
  }]

  const options = {
    "chart_type": "map",
    "spatial_bins": true,
    "bin_by": "location.selection.id",
    "aggregation_names": [
      "homesteads found"
    ],
    "property_layers": [
      "risk"
    ]
  }

  const features = [
    {
      geometry: [],
      properties: {
        __disarm_geo_id: '1'
      }
    },
    {
      geometry: [],
      properties: {
        __disarm_geo_id: '2'
      }
    }
  ]

  it('creates a row for each unique response.location.selection.id', () => {

    // populate cache with a featureCollection,
    // the name of the collection must match options.spatial_aggregation_level
    const level = 'my_level'
    options.spatial_aggregation_level = level
    cache.geodata[level] = featureCollection(features)

    // Each feature in the featureCollection must have '__disarm_geo_id' on it that matches 'bin_by'

    // we use the function decorate_for_map
    // it relies on the cache to create/extend a featureCollection
    const result_fc = get_data({responses, targets, aggregations, options})

    // Expected result
    const location_ids = responses.map(response => response.location.selection.id)
    const unique_location_ids = uniq(location_ids)

    assert.equal(result_fc.features.length, unique_location_ids.length)
  })

  it('somehow notifies user that there are responses not shown on map', () => {

    assert(false, 'unimplemented')
  })

  it('does not include in rows-to-display any row with a custom location-selection', () => {
    const result = get_data({responses, targets, aggregations, options})
    // assert the length of the out is not equal to the input, as one response doesn't have a valid location.selection for map

    assert(false, 'unimplemented')
  })
})
