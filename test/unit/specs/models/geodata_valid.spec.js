import cache from 'config/cache'
import {geodata_valid} from 'lib/geodata/geodata.valid'
import {configure_spatial_helpers} from 'lib/geodata/spatial_hierarchy_helper'

const instance_config = {
  spatial_hieararchy: {
    "data_version": 1,
    "markers": {
      "planning_level_name": "villages",
      "record_location_selection_level_name": "constituencies",
      "denominator_fields": {
        "number_of_households": "NumHouseholds"
      }
    },
    "levels": [
      {
        "group_by_field": "REGION",
        "field_name": "OBJECTID",
        "display_field_name": "CONST",
        "name": "constituencies"
      },
      {
        "field_name": "id",
        "display_field_name": "name",
        "name": "villages"
      }
    ]
  }
}


describe('geodata.valid.js', () => {
  configure_spatial_helpers(instance_config)

  it('can validate empty geojson', () => {
    const geodata = {}

    cache.geodata = geodata
    const is_valid = geodata_valid()
    assert.isFalse(is_valid)
  })

  it('can validate keys but no geojson', () => {
    const geodata = {
      villages: {},
      constituencies: {}
    }

    cache.geodata = geodata
    const is_valid = geodata_valid()
    assert.isFalse(is_valid)
  })

  it('can validate keys but wrong geojson', () => {
    const geodata = {
      villages: {fake_data: 'I am not geojson'},
      constituencies: {fake_data: 'I am not geojson'}
    }

    cache.geodata = geodata
    const is_valid = geodata_valid()
    assert.isFalse(is_valid)
  })

  it('can validate keys and geojson but wrong geojson', () => {
    const geodata = {
      villages: {
        type: 'FeatureCollection',
        features: []
      },
      constituencies: {
        type: 'FeatureCollection',
        features: []
      }
    }

    cache.geodata = geodata
    const is_valid = geodata_valid()
    assert.isFalse(is_valid)
  })

  it('can validate correct keys and geojson', () => {
    const geodata = {
      villages: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: []
        }]
      },
      constituencies: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: []
        }]
      }
    }

    cache.geodata = geodata
    const is_valid = geodata_valid()
    assert.isTrue(is_valid)
  })
})
