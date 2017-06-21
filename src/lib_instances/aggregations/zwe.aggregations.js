export default {
  'homesteads found': {
    numerator_function: () => 1
  },
  'structures found': {
    numerator_function: (d) => d.number_sprayable + d.number_unsprayable
  },
  'structures found %': {
    numerator_function: (d) => d.number_sprayable + d.number_unsprayable,
    denominator_field: 'number_of_households'
  },
  "structures sprayed": {
    numerator_function: (d) => d.numbersprayed_PY + d.numbersprayed_ddt + d.numbersprayed_OP
  },
  'structures sprayed %': {
    numerator_function: (d) => d.numbersprayed_PY + d.numbersprayed_ddt + d.numbersprayed_OP,
    denominator_field: 'number_of_households'
  },
  'sprayable structures not sprayed': {
    numerator_function: (d) => (d.number_sprayable - (d.numbersprayed_PY + d.numbersprayed_ddt + d.numbersprayed_OP))
  },
  'sprayable structures not sprayed (refused)': {
    precondition: (d) => d.reasons_notspraying.includes('refused'),
    numerator_function: (d) => (d.number_sprayable - (d.numbersprayed_PY + d.numbersprayed_ddt + d.numbersprayed_OP))
  },
  'sprayable structures not sprayed (refused) %': {
    precondition: (d) => d.reasons_notspraying.includes('refused'),
    numerator_function: (d) => (d.number_sprayable - (d.numbersprayed_PY + d.numbersprayed_ddt + d.numbersprayed_OP)),
    denominator_field: 'number_of_households'
  }
}

