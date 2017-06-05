import numeral from 'numeral'

function percentage(value) {
  return numeral(value).format('0.[0]%')
}

export default {

  'number of buildings targeted': (responses, denominator, results_so_far) => {
    return denominator['structures_targeted']
  },

  'number of people in the homestead (<5 yrs)': (responses, denominator, results_so_far) => {
    return responses.reduce((sum, {form_data}) => {
      return sum + form_data.ppl_in_hs_under5      
    }, 0)
  },

  'number of people in the homestead (>5 yrs)': (responses, denominator, results_so_far) => {
    return responses.reduce((sum, {form_data}) => {
      return sum + form_data.ppl_in_hs_above5      
    }, 0)
  },

  'number of people in homestead (total)': (responses, denominator, results_so_far) => {
    return responses.reduce((sum, {form_data}) => {
      return sum + form_data.ppl_in_hs_above5 + form_data.ppl_in_hs_under5
    }, 0)
  },

  'number of buildings visited': (responses, denominator, results_so_far) => {
    return responses.reduce((sum, {form_data}) => {
      return sum + form_data.n_buildings
    }, 0)
  },

  'number of rooms visited': (responses, denominator, results_so_far) => {
    return responses.reduce((sum, {form_data}) => {
      return sum + form_data.room_count
    }, 0)
  },

  'number of rooms sprayed (total)': (responses, denominator, results_so_far) => {
    return responses.reduce((sum, {form_data}) => {
      return sum + form_data.number_sprayed_ddt + form_data.number_sprayed_lambdacyhalothrin
    }, 0)
  },

  'number of rooms sprayed (DDT)': (responses, denominator, results_so_far) => {
    return responses.reduce((sum, {form_data}) => {
      return sum + form_data.number_sprayed_ddt
    }, 0)
  },

  'number of rooms sprayed (lambda-cyhalothrin)': (responses, denominator, results_so_far) => {
    return responses.reduce((sum, {form_data}) => {
      return sum + form_data.number_sprayed_lambdacyhalothrin
    }, 0)
  }

}

