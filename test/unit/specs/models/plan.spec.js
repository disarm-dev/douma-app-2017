import cache from 'config/cache'
import {Plan} from 'lib/models/plan/plan.model.js'

xdescribe('Plan model', () => {

  cache.geodata = {
    all_target_areas:
      {
        features: [
          {
            properties: {
              AggUniCode: '1ish',
              NmStrct: 2
            }
          }
        ]
      }
  }

  const top_level_spatial_hierarchy = {
    "denominator": {
      "number_of_structures": "NmStrct"
    },
    "field_name": "AggUniCode",
    "name": "localities"
  }

  it('should be created with valid inputs', () => {
    const country = 'bob'
    const selected_target_area_ids = ['1ish']

    const plan = new Plan().create({country, selected_target_area_ids, top_level_spatial_hierarchy})

    assert.isObject(plan)
    assert.isArray(plan.targets)

  })

  it('should not be created with missing target_area_ids', () => {
    const country = 'bob'
    const selected_target_area_ids = null
    const fn = () => new Plan().create({country, selected_target_area_ids, top_level_spatial_hierarchy})

    assert.throws(fn, /missing selected_target_area_ids/i)
  })

  it('should not be created with missing country', () => {
    const country = null
    const selected_target_area_ids = ['1ish']
    const fn = () => new Plan().create({country, selected_target_area_ids, top_level_spatial_hierarchy})

    assert.throws(fn, 'PlanSchema validation failed')
  })

  it('should not be created with invalid target_areas', () => {
    const country = 'bob'
    const selected_target_area_ids = ['2ish']
    const fn = () => new Plan().create({country, selected_target_area_ids, top_level_spatial_hierarchy})

    assert.throws(fn, 'PlanSchema validation failed')
  })

  it('should not be created with empty target_areas', () => {
    const country = 'bob'
    const selected_target_area_ids = []
    const fn = () => new Plan().create({country, selected_target_area_ids, top_level_spatial_hierarchy})

    assert.throws(fn, 'PlanSchema validation failed')
  })
})
