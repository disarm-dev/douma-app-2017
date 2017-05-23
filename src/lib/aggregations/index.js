import numeral from 'numeral'
import moment from 'moment'

import bwa from './bwa.aggregations.js'
import nam from './nam.aggregations.js'
import swz from './swz.aggregations.js'
import zwe from './zwe.aggregations.js'

const fields = {bwa, nam, swz, zwe}

export default class {
  constructor({responses, plan, instance_config}){
    responses = this.get_time_series(responses)

    const denominator = plan
    const spatial_filter_level = instance_config.spatial_hierarchy[0].name

    const areas = denominator.map(d => d[spatial_filter_level])
    const instance_fields = fields[instance_config.slug.toLowerCase()]

    return areas.map(area => {
      const filter = (res) => {
        // if(time_period) {
        //   return res[spatial_filter_level] === area && moment(res.recorded_on).week() === time_period
        // } else {
          return res[spatial_filter_level] === area
        // }
      }

      let output = {}
      output[spatial_filter_level] = area

      const filtered_responses = responses.filter(filter)
      const filtered_denominator = denominator.filter(filter)[0]
      Object.keys(instance_fields).forEach(field_name => {
        output[field_name] = instance_fields[field_name](filtered_responses, filtered_denominator, output)
      })

      return output
    })
  }

  filter_by_spatial_hierarchy() {

  }

  filter_by_timeseries() {

  }

  get_denominator_from_plan(plan) {
    // TODO: @feature Create denominator from a passed-in plan
    return plan
  }
}

// return {
//   filtered_by_spatial_hierarchy: [],
//   filtered_by_timeseries: []
// }

// filtered_by_time = {
//   all_time: {
//     all_areas: {},
//     area1: {}
//   },
//   week1: {
//     all_areas: {},
//     area1: {}
//   },
//   week2: {},
// }




// BWA
// Output from helper
// "first_entry_new_village"
// "team_leader_name"
// "village_chobe"
// "household_name"
// "n_buildings"
// "n_people_homestead"
// "n_people_homestead_underage5"
// "n_people_homestead_overage5"
// "LLIN_used_sleeping"
// "number_LLIN_used"
// "room_count"
// "number_rooms_modern"
// "number_rooms_traditional"
// "number_other_structures"
// "sprayed"
// "reason_no_sprayed"
// "n_nospray_reason"
// "n_LLINs_given_nospray"
// "number_LLINS_given"
// "were_spray_allrooms"
// "number_sprayed_ddt"
// "number_sprayed_lambdacyhalothrin"
// "number_other_sprayed_ddt"
// "number_other_sprayed_lambdacyhalothrin"
// "n_unsprayed"
// "n_unsprayed_modern"
// "n_unsprayed_traditional"
// "n_unsprayed_reason_partialspray"
// "n_LLINs_given_partialspray"
// "n_LLINs_given"
// "number_sprayed"
// "number_sprayed_modern_partial_spray"
// "number_sprayed_traditional_partial_spray"
// "number_sprayed_other_partial_spray"







// NAM
// Output from elements_array:
// "sprayable"
// "number_sprayable"
// "number_unsprayable"
// "numbersprayed_ddt"
// "numbersprayed_delta"
// "sprayable_unsprayed"
// "number_unsprayed"
// "reasons_notspraying"
// "Unsprayable_reason"
// "house_population"
// "total_population_sprayedrooms"
// "region"
// "district"
// "village"
// "team_leader"
// "name_household"
// "health_number"
// "confirm"
// "number_bednets"






