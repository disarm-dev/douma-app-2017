export default class {
  constructor({responses, plan}) {
    this.$responses = this.$get_responses()
    this.$denominator = this.$calculate_denominator(plan)
    const villages = this.$denominator.map(d => d.village)
    const fields = Object.keys(this).filter(key => !/^\$/.test(key))

    return villages.map(village => {
      const filter = (res) => res.village === village

      let output = {}
      output.village = village

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

  'number of buildings targeted' = (responses, denominator, results_so_far) => {
    return denominator['n_buildings_targeted']
  }

  'number of people in the homestead (<5 yrs)' = (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      return sum + r.n_people_homestead_underage5      
    }, 0)
  }

  'number of people in the homestead (>5 yrs)' = (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      return sum + r.n_people_homestead_overage5      
    }, 0)
  }

  'number of buildings visited' = (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      return sum + r.n_buildings
    }, 0)
  }

  'number of rooms visited' = (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      return sum + r.room_count
    }, 0)
  }

  'number of rooms sprayed (total)' = (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      return sum + r.number_sprayed_ddt + r.number_sprayed_lambdacyhalothrin
    }, 0)
  }

  'number of rooms sprayed (DDT)' = (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      return sum + r.number_sprayed_ddt
    }, 0)
  }

  'number of rooms sprayed (lambda-cyhalothrin)' = (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      return sum + r.number_sprayed_lambdacyhalothrin
    }, 0)
  }


  // 'structures found' = (responses, denominator, results_so_far) =>  {
  //   return responses.reduce((sum, r) => {
  //     return sum + r.number_sprayable + r.number_unsprayable
  //   }, 0)
  // }
}

const seed_responses = [{
  "village": "Kavimba",
  "n_buildings": 9,
  "room_count": 27,
  "n_people_homestead_underage5": 90,
  "n_people_homestead_overage5": 72,
  "number_sprayed_lambdacyhalothrin": 24,
  "number_sprayed_ddt": 2
}, {
  "village": "CAD565",
  "n_buildings": 7,
  "room_count": 35,
  "n_people_homestead_underage5": 49,
  "n_people_homestead_overage5": 49,
  "number_sprayed_lambdacyhalothrin": 12,
  "number_sprayed_ddt": 13
}, {
  "village": "Kazungula",
  "n_buildings": 9,
  "room_count": 27,
  "n_people_homestead_underage5": 63,
  "n_people_homestead_overage5": 63,
  "number_sprayed_lambdacyhalothrin": 25,
  "number_sprayed_ddt": 0
}, {
  "village": "Lesoma",
  "n_buildings": 6,
  "room_count": 30,
  "n_people_homestead_underage5": 30,
  "n_people_homestead_overage5": 48,
  "number_sprayed_lambdacyhalothrin": 10,
  "number_sprayed_ddt": 0
}, {
  "village": "CH5",
  "n_buildings": 10,
  "room_count": 20,
  "n_people_homestead_underage5": 70,
  "n_people_homestead_overage5": 90,
  "number_sprayed_lambdacyhalothrin": 13,
  "number_sprayed_ddt": 1
}, {
  "village": "Kachikau",
  "n_buildings": 6,
  "room_count": 18,
  "n_people_homestead_underage5": 42,
  "n_people_homestead_overage5": 42,
  "number_sprayed_lambdacyhalothrin": 0,
  "number_sprayed_ddt": 17
}, {
  "village": "Parakarugu",
  "n_buildings": 9,
  "room_count": 27,
  "n_people_homestead_underage5": 81,
  "n_people_homestead_overage5": 81,
  "number_sprayed_lambdacyhalothrin": 6,
  "number_sprayed_ddt": 15
}, {
  "village": "Kazungula",
  "n_buildings": 9,
  "room_count": 36,
  "n_people_homestead_underage5": 90,
  "n_people_homestead_overage5": 72,
  "number_sprayed_lambdacyhalothrin": 22,
  "number_sprayed_ddt": 0
}, {
  "village": "Lesoma",
  "n_buildings": 8,
  "room_count": 24,
  "n_people_homestead_underage5": 64,
  "n_people_homestead_overage5": 72,
  "number_sprayed_lambdacyhalothrin": 17,
  "number_sprayed_ddt": 6
}, {
  "village": "CH5",
  "n_buildings": 6,
  "room_count": 30,
  "n_people_homestead_underage5": 60,
  "n_people_homestead_overage5": 42,
  "number_sprayed_lambdacyhalothrin": 22,
  "number_sprayed_ddt": 7
}]

const seed_denominator = [{
  "village": "Kachikau",
  "n_buildings_targeted": 860
}, {
  "village": "Kavimba",
  "n_buildings_targeted": 728
}, {
  "village": "Kazungula",
  "n_buildings_targeted": 1757
}, {
  "village": "Lesoma",
  "n_buildings_targeted": 1381
}, {
  "village": "Mabele",
  "n_buildings_targeted": 1583
}, {
  "village": "Pandamatenga",
  "n_buildings_targeted": 1122
}, {
  "village": "Parakarugu",
  "n_buildings_targeted": 467
}, {
  "village": "Satau",
  "n_buildings_targeted": 1697
}, {
  "village": "CH5",
  "n_buildings_targeted": 1674
}, {
  "village": "CAD565",
  "n_buildings_targeted": 1351
}]

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

