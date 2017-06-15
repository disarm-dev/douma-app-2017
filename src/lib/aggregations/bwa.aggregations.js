export default {
  'number of buildings targeted': {
    denominator_field: 'structures_targeted'
  },

  'number of people in the homestead (<5 yrs)': {
    numerator_function: (d) => d.ppl_in_hs_under5
  },

  'number of people in the homestead (>5 yrs)': {
    numerator_function: (d) => d.ppl_in_hs_above5
  },

  'number of people in homestead (total)': {
    numerator_function: (d) => d.ppl_in_hs_above5 + d.ppl_in_hs_under5
  },

  'number of buildings visited': {
    numerator_function: (d) => d.n_buildings
  },

  'number of rooms visited': {
    numerator_function: (d) => d.room_count
  },

  'number of rooms sprayed (total)': {
    numerator_function: (d) => d.number_sprayed_ddt + d.number_sprayed_lambdacyhalothrin
  },

  'number of rooms sprayed (DDT)': {
    numerator_function: (d) => d.number_sprayed_ddt
  },

  'number of rooms sprayed (lambda-cyhalothrin)': {
    numerator_function: (d) => d.number_sprayed_lambdacyhalothrin
  }

}

