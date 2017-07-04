export default {
  'number of buildings targeted': {
    denominator_field: 'structures_targeted'
  },

  'number of people in the homestead (<5 yrs)': {
    numerator_expr: "ppl_in_hs_under5"
  },

  'number of people in the homestead (>5 yrs)': {
    numerator_expr: "ppl_in_hs_above5"
  },

  'number of people in homestead (total)': {
    numerator_expr: "ppl_in_hs_above5 + ppl_in_hs_under5"
  },

  'number of buildings visited': {
    numerator_expr: "n_buildings"
  },

  'number of rooms visited': {
    numerator_expr: "room_count"
  },

  'number of rooms sprayed (total)': {
    numerator_expr: "number_sprayed_ddt + number_sprayed_lambdacyhalothrin"
  },

  'number of rooms sprayed (DDT)': {
    numerator_expr: "number_sprayed_ddt"
  },

  'number of rooms sprayed (lambda-cyhalothrin)': {
    numerator_expr: "number_sprayed_lambdacyhalothrin"
  }
}

