import get_data from 'apps/irs_monitor/lib/get_data_for_viz'
import {featureCollection} from '@turf/helpers'
import {uniq, remove} from 'lodash'
import cache from 'config/cache'

xdescribe('responses displayed on map', () => {
  const expected = {}

  // beforeEach(() => {
    // set seed data on expected
    // use expected in tests to ensure that the seed data is not mutated during a previous test
  // })

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

    // Add a response which does not have an id in location.selection
    const custom_location_response = {
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
          name: 'custom location'
        }
      }
    }

    const all_responses = responses.concat(custom_location_response)

    const result_fc = get_data({responses: all_responses, targets, aggregations, options})

    // Get all ids from responses
    const location_ids = responses.map(response => response.location.selection.id)
    const unique_location_ids = uniq(location_ids)

    // Assert that adding a response without a location.selection.id does not create a new feature for that response.
    assert.equal(result_fc.features.length, unique_location_ids.length)
  })
})
