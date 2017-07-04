export default {
  'homesteads found': {
    numerator_expr: "1"
  },
  'structures found': {
    numerator_expr: "number_structures_total"
  },
  'structures found %': {
    numerator_expr: "number_structures_total",
    denominator_field: 'structures_targeted'
  },
  'structures sprayed': {
    numerator_expr: "number_of_structures_sprayed"
  },
  "structures sprayed %": {
    numerator_expr: "number_of_structures_sprayed",
    denominator_field: 'number_of_structures'
  },
  'sprayable structures not sprayed': {
    numerator_expr: "number_structures_total - number_of_structures_sprayed"
  }
}
