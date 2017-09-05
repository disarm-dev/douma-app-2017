import get_data from 'apps/irs_monitor/lib/get_data_for_viz'

xdescribe('responses displayed on map', () => {
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
          name: "location"
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
          name: "location",
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

  it('creates a row for each unique response.location.selection.name', () => {

    // we use the function decorate_for_map
    // it relies on the cache to create/extend a featureCollection
    const result = get_data({responses, targets, aggregations, options})

    assert(false, 'unimplemented')
  })

  it('does not include in rows-to-display any row with a custom location-selection', () => {
    const result = get_data({responses, targets, aggregations, options})
    // assert the length of the out is not equal to the input, as one response doesn't have a valid location.selection for map

    assert(false, 'unimplemented')
  })

  it('somehow notifies user that there are responses not shown on map', () => {

    assert(false, 'unimplemented')
  })
})
