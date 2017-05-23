export default class {
  constructor({responses, plan}) {
    this.$responses = this.$get_responses()
    this.$denominator = this.$calculate_denominator(plan)
    const regions = this.$denominator.map(d => d.region)
    const fields = Object.keys(this).filter(key => !/^\$/.test(key))
    console.log(fields)

    return regions.map(region => {
      const filter = (res) => res.region === region

      let output = {}
      output.region = region

      const filtered_responses = this.$responses.filter(filter)
      const filtered_denominator = this.$denominator.filter(filter)[0]

      fields.forEach(field => {
        output[field] = this[field](filtered_responses, filtered_denominator, output)
      })

      return output
    })
  }

  $get_responses() {
    return seed_responses
  }

  $calculate_denominator(plan) {
    return seed_denominator
  }

  $percentage(value) {
    return numeral(value).format('0.[0]%')
  }

  'homesteads found' = (responses, denominator, results_so_far) => {
    return 13
    return responses.length
  }

  // 'structures found' = (responses, denominator, results_so_far) =>  {
  //   return responses.reduce((sum, r) => {
  //     return sum + r.number_sprayable + r.number_unsprayable
  //   }, 0)
  // }
}

const seed_responses = [
{region: 1}, {region: 2}, {region: 3}
]

const seed_denominator = [{region: 1}, {region: 2}, {region: 3}
]

// Output from helper
// "first_entry_new_village"
// "team_leader_name"
// "village_chobe"
// "household_name"
// "n_buildings"
// "n_people_homestead"
// "n_people_homestead_underage5"
// "question1"
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
// "question3"
// "number_sprayed"
// "number_sprayed_modern_partial_spray"
// "number_sprayed_traditional_partial_spray"
// "number_sprayed_other_partial_spray"