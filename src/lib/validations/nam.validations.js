export default [
  {
    name: 'total_sprayed',
    fn: (f) => {
      if (f.sprayable_unsprayed === 'yes') return true

      return f.numbersprayed_ddt + f.numbersprayed_delta == f.number_sprayable
    },
    message: 'Total sprayed does not equal `ddt`+ `deltamethrin`.',
    type: "warning",
    relevant_questions: ["sprayable_unsprayed", "numbersprayed_ddt", "numbersprayed_delta", "number_sprayable"]
  },
  {
    name: 'sprayable_unsprayed',
    fn: (f) => {
      if (f.sprayable_unsprayed === 'yes') return true

      return f.numbersprayed_ddt + f.numbersprayed_delta + f.number_unsprayed == f.number_sprayable
    },
    message: "Number of unsprayed structures doesn't add up",
    type: "warning",
    relevant_questions: ["sprayable_unsprayed", "numbersprayed_ddt", "numbersprayed_delta", "number_unsprayed", "number_sprayable"]
  }
]
