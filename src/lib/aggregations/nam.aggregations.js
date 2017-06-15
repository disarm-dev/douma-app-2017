export default {
  'homesteads found': {
    numerator_function: () => 1
  },
  'structures found': {
    numerator_function: (d) => d.number_sprayable + d.number_unsprayable
  },
  'structures found %': {
    numerator_function: (d) => d.number_sprayable + d.number_unsprayable,
    denominator_field: 'number_of_structures'
  },
  "structures sprayed": {
    numerator_function: (d) => d.numbersprayed_delta + d.numbersprayed_ddt
  },
  'structures sprayed %': {
    numerator_function: (d) => d.numbersprayed_delta + d.numbersprayed_ddt,
    denominator_field: 'number_of_structures'
  },
  'sprayable structures not sprayed': {
    numerator_function: (d) => (d.number_sprayable - (d.numbersprayed_delta + d.numbersprayed_ddt))
  },
  'sprayable structures not sprayed (refused)': {
    precondition: (d) => d.reasons_notspraying.includes('refused'),
    numerator_function: (d) => (d.number_sprayable - (d.numbersprayed_delta + d.numbersprayed_ddt))
  },
  'sprayable structures not sprayed (refused) %': {
    precondition: (d) => d.reasons_notspraying.includes('refused'),
    numerator_function: (d) => (d.number_sprayable - (d.numbersprayed_delta + d.numbersprayed_ddt)),
    denominator_field: 'number_of_structures'
  }
}

