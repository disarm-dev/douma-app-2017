import numeral from 'numeral'
import moment from 'moment'

import bwa from './bwa.aggregations.js'
import nam from './nam.aggregations.js'
import swz from './swz.aggregations.js'
import zwe from './zwe.aggregations.js'

const all_aggregations = {bwa, nam, swz, zwe}

export default class {
  // responses: Array of responses
  // denominator: Array of


  constructor({responses, denominator, instance_config}){
    // Get instance-specific aggregation functions
    const instance_aggregations = all_aggregations[instance_config.slug.toLowerCase()]

    // Get first instance-specific spatial filter (e.g. 'village')
    const spatial_filter_level = instance_config.spatial_hierarchy[0].name

    // Extract (unique?) spatial options from denominator (i.e. list of areas)
    const areas = denominator.map(d => d[spatial_filter_level])

    // Do all aggregations for each instance-specific area (e.g. each village)
    const result = areas.map(area => {
      const group_by = (res) => res[spatial_filter_level] === area

      let output = {}
      output[spatial_filter_level] = area

      // Get responses + denominator matching aggregation _group_by_ filter
      const filtered_responses = responses.filter(group_by)
      const filtered_denominator = denominator.find(group_by)

      // Iterate every method in instance-specific list, applying to data
      const aggregation_method_names = Object.keys(instance_aggregations)
      aggregation_method_names.forEach(field_name => {
        const aggregate = instance_aggregations[field_name]
        output[field_name] = aggregate(filtered_responses, filtered_denominator, output)
      })

      return output
    })

    // Return sample:
    // [{village: 'A', number_structures: 10}, {village: 'B', number_structures: 15}]

    return result
  }

}



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






