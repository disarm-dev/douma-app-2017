
export default {

  'number of buildings targeted': (responses, denominator, results_so_far) => {
    return denominator['n_buildings_targeted']
  },

  'number of people in the homestead (<5 yrs)': (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      return sum + r.n_people_homestead_underage5      
    }, 0)
  },

  'number of people in the homestead (>5 yrs)': (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      return sum + r.n_people_homestead_overage5      
    }, 0)
  },

  'number of buildings visited': (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      return sum + r.n_buildings
    }, 0)
  },

  'number of rooms visited': (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      return sum + r.room_count
    }, 0)
  },

  'number of rooms sprayed (total)': (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      return sum + r.number_sprayed_ddt + r.number_sprayed_lambdacyhalothrin
    }, 0)
  },

  'number of rooms sprayed (DDT)': (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      return sum + r.number_sprayed_ddt
    }, 0)
  },

  'number of rooms sprayed (lambda-cyhalothrin)': (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      return sum + r.number_sprayed_lambdacyhalothrin
    }, 0)
  }

}

