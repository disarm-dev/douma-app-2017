export default {
  'homesteads found': {
    numerator_function: () => 1
  },
  'structures found': {
    numerator_function: (d) => d.number_structures_total
  },
  'structures found %': {
    numerator_function: (d) => d.number_structures_total,
    denominator_field: 'structures_targeted'
  },
  'structures sprayed': {
    numerator_function: (d) => d.number_of_structures_sprayed
  },
  "structures sprayed %": {
    numerator_function: (d) => d.number_of_structures_sprayed,
    denominator_field: 'number_of_structures'
  },
  'sprayable structures not sprayed': {
    numerator_function: (d) => d.number_structures_total - d.number_of_structures_sprayed
  }
}
