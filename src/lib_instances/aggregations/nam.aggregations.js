export default {
  'homesteads found': {
    numerator_expr: "1"
  },
  'structures found': {
    numerator_expr: "number_sprayable + number_unsprayable"
  },
  'structures found %': {
    numerator_expr: "number_sprayable + number_unsprayable",
    denominator_field: 'number_of_households'
  },
  "structures sprayed": {
    numerator_expr: "numbersprayed_delta + numbersprayed_ddt"
  },
  'structures sprayed %': {
    numerator_expr: "numbersprayed_delta + numbersprayed_ddt",
    denominator_field: 'number_of_households'
  },
  'sprayable structures not sprayed': {
    numerator_expr: "number_sprayable - (numbersprayed_delta + numbersprayed_ddt)"
  },
  'sprayable structures not sprayed (refused)': {
    numerator_expr: "number_sprayable - (numbersprayed_delta + numbersprayed_ddt)"
  },
  'sprayable structures not sprayed (refused) %': {
    numerator_expr: "number_sprayable - (numbersprayed_delta + numbersprayed_ddt)",
    denominator_field: 'number_of_households'
  }
}

