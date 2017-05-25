import numeral from 'numeral'

function percentage(value) {
  return numeral(value).format('0.[0]%')
}

export default {

  'number of buildings targeted': (records, denominator, results_so_far) => {
    return denominator['n_buildings_targeted']
  },

  'number of people in the homestead (<5 yrs)': (records, denominator, results_so_far) => {
    return records.reduce((sum, r) => {
      return sum + r.n_people_homestead_underage5
    }, 0)
  },

  'number of people in the homestead (>5 yrs)': (records, denominator, results_so_far) => {
    return records.reduce((sum, r) => {
      return sum + r.n_people_homestead_overage5
    }, 0)
  },

  'number of people in homestead (total)': (records, denominator, results_so_far) => {
    return records.reduce((sum, r) => {
      return sum + r.n_people_homestead_overage5 + r.n_people_homestead_underage5
    }, 0)
  },

  'number of buildings visited': (records, denominator, results_so_far) => {
    return records.reduce((sum, r) => {
      return sum + r.n_buildings
    }, 0)
  },

  'number of rooms visited': (records, denominator, results_so_far) => {
    return records.reduce((sum, r) => {
      return sum + r.room_count
    }, 0)
  },

  'number of rooms sprayed (total)': (records, denominator, results_so_far) => {
    return records.reduce((sum, r) => {
      return sum + r.number_sprayed_ddt + r.number_sprayed_lambdacyhalothrin
    }, 0)
  },

  'number of rooms sprayed (DDT)': (records, denominator, results_so_far) => {
    return records.reduce((sum, r) => {
      return sum + r.number_sprayed_ddt
    }, 0)
  },

  'number of rooms sprayed (lambda-cyhalothrin)': (records, denominator, results_so_far) => {
    return records.reduce((sum, r) => {
      return sum + r.number_sprayed_lambdacyhalothrin
    }, 0)
  }

}

