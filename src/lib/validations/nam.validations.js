export default [
  {
    name: 'total_sprayed_structures',
    fn: (f) => (f.sprayable_unsprayed === 'yes') ||  (f.numbersprayed_ddt + f.numbersprayed_delta == f.number_sprayable),
    message: 'Total sprayed does not equal `ddt`+ `deltamethrin`.',
    type: "warning",
    relevant_questions: ["number_sprayable", "numbersprayed_ddt", "numbersprayed_delta", "sprayable_unsprayed"]
  },
  {
    name: 'sprayable_unsprayed',
    fn: (f) => (f.sprayable_unsprayed === 'no') || (f.number_sprayable === (f.numbersprayed_ddt + f.numbersprayed_delta + f.number_unsprayed)),
    message: "Number of structures doesn't add up",
    type: "warning",
    relevant_questions: ["number_sprayable", "sprayable_unsprayed", "numbersprayed_ddt", "numbersprayed_delta", "number_unsprayed"]
  },
  {
    name: 'high_number_of_sprayed',
    fn: (f) => (f.sprayable === 'yes') && f.number_sprayable < 20,
    message: "Number of sprayable structures seems high. Please check the value.",
    type: "warning",
    relevant_questions: ["number_sprayable", "sprayable"]
  }
]
