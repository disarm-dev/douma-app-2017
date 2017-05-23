import numeral from 'numeral'

export default class {
  constructor({responses, plan}) {
    this.$responses = this.$get_responses()
    this.$denominator = this.$calculate_denominator(plan)
    const regions = this.$denominator.map(d => d.region)
    const fields = Object.keys(this).filter(key => !/^\$/.test(key))

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
    return responses.length
  }

  'structures found' = (responses, denominator, results_so_far) =>  {
    return responses.reduce((sum, r) => {
      return sum + r.number_sprayable + r.number_unsprayable
    }, 0)
  }

  'structures found %' = (responses, denominator, results_so_far) => {
    return this.$percentage(results_so_far['structures found'] / denominator.structures_targeted)
  }

  "structures sprayed" = (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      return sum + r.numbersprayed_delta + r.numbersprayed_ddt
    }, 0)
  }

  'structures sprayed %' = (responses, denominator, results_so_far) => {
    return this.$percentage(results_so_far['structures sprayed'] / denominator.structures_targeted)
  }

  'sprayable structures not sprayed' = (responses, denominator, results_so_far) =>  {
    return responses.reduce((sum, r) => {
      return sum + (r.number_sprayable - (r.numbersprayed_delta + r.numbersprayed_ddt))
    }, 0)
  }

  'sprayable structures not sprayed (refused)' = (responses, denominator, results_so_far) =>  {
    return responses.reduce((sum, r) => {
      if(r.reasons_notspraying.includes('refused')) {
        return sum + (r.number_sprayable - (r.numbersprayed_delta + r.numbersprayed_ddt))
      } else {
        return sum
      }
    }, 0)
  }

  'sprayable structures not sprayed (refused) %' = (responses, denominator, results_so_far) => {
    return this.$percentage(results_so_far['sprayable structures not sprayed (refused)'] / denominator.structures_targeted)
  }

  'sprayable structures not sprayed(other reason)' = (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      if(!r.reasons_notspraying.includes('refused')) {
        return sum + (r.number_sprayable - (r.numbersprayed_delta + r.numbersprayed_ddt))
      } else {
        return sum
      }
    }, 0)
  }

  'sprayable structures not sprayed (other reason) %' = (responses, denominator, results_so_far) => {
    return this.$percentage(results_so_far['sprayable structures not sprayed(other reason)'] / denominator.structures_targeted)
  }

}

// Denominator will need to be created/aggregated from a "PLAN"
const seed_denominator = [{"region":"Andara","homesteads_targeted":10375,"structures_targeted":83000},
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

const seed_responses = [
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