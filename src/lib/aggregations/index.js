import numeral from 'numeral'

import bwa from './bwa.aggregations.js'
import nam from './nam.aggregations.js'
import swz from './swz.aggregations.js'
import zwe from './zwe.aggregations.js'

const fields = {bwa, nam, swz, zwe}

export default class {
  constructor({responses, plan, instance_config}){
    responses = this.get_responses()
    const denominator = this.get_denominator_from_plan(plan)

    const spatial_filter_level = instance_config.spatial_hierarchy[0].name

    const areas = denominator.map(d => d[spatial_filter_level])

    const instance_fields = fields[instance_config.slug.toLowerCase()]

    return areas.map(area => {
      const filter = (res) => res[spatial_filter_level] === area

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

  get_responses() {
    return seed_responses_bwa
  }

  get_denominator_from_plan(plan) {
    return seed_denominator_bwa
  }

}

const seed_responses_bwa = [{
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

const seed_denominator_bwa = [{
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







// <<<NAM>>>

// Denominator will need to be created/aggregated from a "PLAN"
const seed_denominator_nam = [{"region":"Andara","homesteads_targeted":10375,"structures_targeted":83000},
{"region":"Eenhana","homesteads_targeted":12829,"structures_targeted":64145},
{"region":"Engela","homesteads_targeted":42016,"structures_targeted":336128},
{"region":"Grootfontein","homesteads_targeted":10849,"structures_targeted":43396},
{"region":"Katima Mulilo","homesteads_targeted":18966,"structures_targeted":132762},
{"region":"Khorixas","homesteads_targeted":36777,"structures_targeted":183885},
{"region":"Nankudu","homesteads_targeted":41025,"structures_targeted":246150},
{"region":"Nyangana","homesteads_targeted":40969,"structures_targeted":204845},
{"region":"Okahao","homesteads_targeted":45199,"structures_targeted":361592},
{"region":"Okakarara","homesteads_targeted":32933,"structures_targeted":197598},
{"region":"Okongo","homesteads_targeted":45366,"structures_targeted":136098},
{"region":"Onandjokwe","homesteads_targeted":23938,"structures_targeted":143628},
{"region":"Opuwo","homesteads_targeted":8910,"structures_targeted":44550},
{"region":"Oshakati","homesteads_targeted":10344,"structures_targeted":62064},
{"region":"Oshikuku","homesteads_targeted":35947,"structures_targeted":143788},
{"region":"Otjiwarongo","homesteads_targeted":45855,"structures_targeted":183420},
{"region":"Outapi","homesteads_targeted":30317,"structures_targeted":90951},
{"region":"Outjo","homesteads_targeted":17866,"structures_targeted":125062},
{"region":"Rundu","homesteads_targeted":26675,"structures_targeted":186725},
{"region":"Tsandi","homesteads_targeted":2225,"structures_targeted":17800},
{"region":"Tsumeb","homesteads_targeted":12786,"structures_targeted":89502}]

const seed_responses_nam = [
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 12,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 12,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 5,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 5,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 6,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 12,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 10,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 5,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 6,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 12,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 5,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 11,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 8,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 5,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 11,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 4,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 5,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 5,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 4,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 11,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 9,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 12,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 6,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 10,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 6,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 7,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 7,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 8,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 7,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 7,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 4,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 11,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 5,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 11,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 6,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 10,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 6,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 4,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 5,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 11,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 9,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 5,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 5,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 7,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 8,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 11,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 10,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 7,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 10,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 6,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 5,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 7,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 5,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 12,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 6,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 7,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 9,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 5,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 12,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 11,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 7,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 5,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 6,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 9,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 8,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 6,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 12,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 10,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 11,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 5,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 6,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 9,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 5,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 10,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 5,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 4,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 4,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 11,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 7,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 4,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 12,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 10,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 5,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 11,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 8,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 7,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 11,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 6,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 12,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 7,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 11,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 9,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 4,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 8,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 5,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 7,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 11,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 10,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 8,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 10,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 4,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 9,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 12,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 10,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 11,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 12,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 9,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 10,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 8,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 8,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 5,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 12,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 12,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 10,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 6,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 11,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 6,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 12,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 8,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 8,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 6,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 6,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 8,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 10,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 8,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 11,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 9,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 7,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 9,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 9,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 10,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 11,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 11,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 8,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 9,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 11,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 8,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 4,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 6,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 10,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 5,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 8,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 11,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 11,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 11,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 10,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 6,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 12,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 11,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 8,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 5,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 8,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 4,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 7,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 8,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 11,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 12,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 9,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 12,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 12,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 11,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 10,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 12,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 5,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 6,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 10,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 4,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 10,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 9,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 11,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 9,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 9,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 9,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 4,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 11,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 10,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 12,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 12,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 5,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 5,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 5,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 12,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 4,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 11,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 8,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 10,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 10,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 9,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 7,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 5,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 10,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 5,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 12,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 4,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 9,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 10,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 9,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 10,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 6,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 6,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 5,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 4,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 12,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 8,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 8,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 6,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 12,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 12,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 4,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 10,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 9,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 12,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 8,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 10,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 11,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 8,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 6,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 5,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 4,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 5,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 6,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 7,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 9,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 5,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 10,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 9,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 7,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 10,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 9,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 8,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 12,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 12,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 8,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 6,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 9,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 10,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 11,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 11,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 5,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 4,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 12,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 10,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 10,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 9,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 12,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 12,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 7,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 12,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 12,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 5,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 7,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 5,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 11,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 12,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 9,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 5,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 10,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 9,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 8,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 7,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 10,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 7,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 12,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 11,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 5,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 6,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 4,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 10,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 6,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 6,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 9,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 8,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 7,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 5,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 12,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 12,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 6,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 6,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 12,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 6,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 6,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 6,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 11,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 10,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 11,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 10,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 4,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 11,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 5,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 11,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 7,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 7,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 11,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 11,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 9,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 10,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 6,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 11,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 5,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 4,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 4,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 11,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 9,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 12,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 12,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 9,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 8,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 11,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 9,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 7,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 6,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 9,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 6,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 6,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 9,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 6,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 11,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 5,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 10,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 9,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 12,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 7,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 12,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 12,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 4,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 10,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 4,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 10,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 8,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 9,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 4,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 6,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 10,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 10,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 11,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 6,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 10,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 11,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 8,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 12,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 8,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 9,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 9,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 6,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 4,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 5,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 9,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 5,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 4,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 4,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 12,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 5,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 12,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 11,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 10,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 9,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 8,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 6,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 10,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 10,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 5,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 12,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 8,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 10,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 7,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 12,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 5,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 6,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 7,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 12,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 9,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 7,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 6,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 8,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 10,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 8,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 7,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 10,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 12,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 4,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 9,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 5,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 10,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 6,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 7,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 11,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 11,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 10,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 10,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 10,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 12,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 10,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 6,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 9,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 10,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 10,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 11,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 11,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 12,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 8,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 10,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 5,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 7,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 4,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 11,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 8,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 11,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 12,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 11,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 10,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 4,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 7,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 8,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 9,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 11,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 4,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 11,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 7,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 5,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 7,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 11,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 11,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 9,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 10,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 12,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 8,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 4,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 5,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 7,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 9,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 10,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 12,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 10,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 5,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 9,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 11,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 7,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 9,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 9,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 11,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 11,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 8,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 7,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 6,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 12,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 8,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 7,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 4,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 10,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 12,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 5,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 10,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 4,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 11,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 9,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 5,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 11,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 9,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 8,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 8,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 6,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 12,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 8,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 7,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 10,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 8,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 9,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 8,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 12,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 7,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 6,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 12,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 7,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 8,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 11,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 6,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 10,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 12,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 9,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 8,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 9,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 8,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 7,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 10,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 4,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 12,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 7,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 6,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 9,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 5,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 7,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 8,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 5,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 6,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 4,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 11,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 7,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 7,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 5,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 11,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 11,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 6,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 10,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 10,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 9,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 7,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 4,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 10,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 10,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 7,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 10,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 8,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 4,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 6,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 6,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 8,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 7,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 8,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 5,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 7,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 6,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 11,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 5,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 7,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 4,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 10,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 6,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 7,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 12,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 5,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 9,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 11,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 9,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 8,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 8,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 5,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 11,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 5,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 11,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 8,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 10,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 7,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 9,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 9,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 12,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 11,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 6,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 8,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 6,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 5,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 6,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 11,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 4,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 7,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 4,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 9,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 8,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 6,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 12,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 10,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 9,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 11,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 4,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 6,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 9,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 9,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 4,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 8,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 12,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 6,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 8,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 11,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 10,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 6,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 12,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 6,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 7,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 8,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 8,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 10,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 6,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 4,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 5,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 6,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 10,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 7,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 10,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 10,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 4,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 7,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 4,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 5,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 10,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 6,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 6,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 11,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 4,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 10,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 9,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 6,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 10,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 4,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 4,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 4,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 4,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 5,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 6,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 7,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 9,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 4,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 4,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 10,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 7,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 4,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 4,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 7,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 5,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 10,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 10,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 8,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 12,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 8,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 12,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 9,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 12,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 9,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 7,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 5,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 12,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 11,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 8,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 5,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 10,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 8,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 8,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 11,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 7,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 8,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 8,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 6,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 4,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 6,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 11,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 10,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 11,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 8,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 5,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 8,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 11,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 9,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 5,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 7,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 6,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 12,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 4,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 4,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 11,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 8,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 10,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 10,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 9,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 11,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 5,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 5,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 4,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 9,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 11,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 9,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 4,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 4,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 6,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 7,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 7,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 9,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 12,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 5,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 10,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 10,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 6,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 9,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 8,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 11,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 5,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 10,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 8,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 6,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 11,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 7,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 6,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 8,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 11,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 4,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 11,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 5,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 10,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 8,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 7,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 9,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 11,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 7,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 8,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 11,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 12,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 8,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 6,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 7,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 7,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 12,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 8,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 12,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 12,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 9,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 4,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 7,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 7,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 6,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 4,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 4,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 9,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 8,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 10,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 10,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 9,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 9,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 10,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 6,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 9,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 8,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 11,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 4,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 9,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 6,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 12,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 4,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 7,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 11,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 5,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 8,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 11,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 10,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 10,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 10,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 9,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 9,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 11,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 10,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 10,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 12,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 4,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 8,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 10,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 6,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 10,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 11,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 8,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 11,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 4,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 6,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 11,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 11,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 6,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 6,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 5,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 6,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 10,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 7,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 9,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 12,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 11,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 5,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 4,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 8,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 11,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 12,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 8,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 8,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 12,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 9,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 6,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 5,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 5,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 4,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 8,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 5,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 10,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 10,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 12,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 10,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 9,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 6,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 6,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 10,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 5,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 12,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 6,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 7,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 5,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 11,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 4,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 9,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 4,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 9,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 8,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 8,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 4,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 4,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 10,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 8,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 9,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 8,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 12,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 9,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 12,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 7,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 12,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 10,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 4,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 7,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 9,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 12,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 12,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 8,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 9,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 7,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 12,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 7,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 7,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 4,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 7,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 7,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 4,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 12,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 10,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 12,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 5,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 5,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 12,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 7,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 10,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 6,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 7,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 6,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 9,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 9,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 9,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 6,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 11,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 9,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 7,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 6,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 12,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 9,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 4,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 4,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 10,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 7,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 5,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 8,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 10,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 9,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 12,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 12,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 5,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 6,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 12,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 12,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 12,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 12,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 6,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 10,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 10,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 7,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 11,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 10,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 7,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 11,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 11,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 10,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 5,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 8,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 9,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 10,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 8,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 12,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 4,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 8,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 4,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 6,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 6,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 5,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 6,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 12,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 11,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 12,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 12,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 12,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 12,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 4,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 12,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Outapi",
    "number_sprayable": 5,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 7,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 11,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 8,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 7,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 9,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 5,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 8,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 6,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 7,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 9,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 11,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 8,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 9,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 6,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 9,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 7,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 7,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 11,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 5,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 5,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 12,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 9,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 8,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 4,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 10,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 8,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 9,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 12,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Oshikuku",
    "number_sprayable": 9,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 11,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 12,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 5,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 8,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 5,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 10,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 7,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okakarara",
    "number_sprayable": 10,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 4,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 8,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Khorixas",
    "number_sprayable": 12,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 4,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 11,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 10,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 5,
    "number_unsprayable": 9,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 10,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsandi",
    "number_sprayable": 12,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 6,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 8,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 7,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 5,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Outjo",
    "number_sprayable": 8,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 5,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 11,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 10,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 9,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 11,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 6,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Opuwo",
    "number_sprayable": 4,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 9,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 12,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 10,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 9,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Grootfontein",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 8,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 9,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 11,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 12,
    "number_unsprayable": 11,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 4,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 5,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "sick_infant"
  },
  {
    "sprayable": "yes",
    "region": "Katima Mulilo",
    "number_sprayable": 11,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 11,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Tsumeb",
    "number_sprayable": 4,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Engela",
    "number_sprayable": 5,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okahao",
    "number_sprayable": 7,
    "number_unsprayable": 7,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Oshakati",
    "number_sprayable": 6,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 3,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 2,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Onandjokwe",
    "number_sprayable": 10,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 10,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 4,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 1,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nankudu",
    "number_sprayable": 9,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 5,
    "numbersprayed_delta": 4,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 9,
    "number_unsprayable": 5,
    "numbersprayed_ddt": 8,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Eenhana",
    "number_sprayable": 4,
    "number_unsprayable": 12,
    "numbersprayed_ddt": 2,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Andara",
    "number_sprayable": 4,
    "number_unsprayable": 8,
    "numbersprayed_ddt": 4,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Nyangana",
    "number_sprayable": 6,
    "number_unsprayable": 6,
    "numbersprayed_ddt": 0,
    "numbersprayed_delta": 3,
    "sprayable_unsprayed": 3,
    "reasons_notspraying": "refused"
  },
  {
    "sprayable": "yes",
    "region": "Otjiwarongo",
    "number_sprayable": 9,
    "number_unsprayable": 4,
    "numbersprayed_ddt": 7,
    "numbersprayed_delta": 2,
    "sprayable_unsprayed": 0,
    "reasons_notspraying": ""
  },
  {
    "sprayable": "yes",
    "region": "Okongo",
    "number_sprayable": 8,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 1,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "locked"
  },
  {
    "sprayable": "yes",
    "region": "Rundu",
    "number_sprayable": 7,
    "number_unsprayable": 10,
    "numbersprayed_ddt": 6,
    "numbersprayed_delta": 0,
    "sprayable_unsprayed": 1,
    "reasons_notspraying": "refused"
  }
]


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






