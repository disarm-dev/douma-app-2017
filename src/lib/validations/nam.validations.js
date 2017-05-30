export default [
  {
    name: 'total_sprayed',
    fn: (f) => {
      if (f.sprayable_unsprayed === 'yes') return true

      return f.numbersprayed_ddt + f.numbersprayed_delta == f.number_sprayable
    },
    message: 'Total sprayed does not equal `ddt`+ `deltamethrin`.',
    type: "warning",
    relevant_questions: ["number_sprayable", "numbersprayed_ddt", "numbersprayed_delta", "sprayable_unsprayed"]
  },
  {
    name: 'sprayable_unsprayed',
    fn: (f) => {
      if (f.sprayable_unsprayed === 'yes') return true

      return f.numbersprayed_ddt + f.numbersprayed_delta + f.number_unsprayed == f.number_sprayable
    },
    message: "Number of unsprayed structures doesn't add up",
    type: "warning",
    relevant_questions: ["number_sprayable", "sprayable_unsprayed", "numbersprayed_ddt", "numbersprayed_delta", "number_unsprayed"]
  },
  {
    name: 'high_number_of_sprayed',
    fn: (f) => {
      if (f.sprayable === 'yes')  {
        return f.number_sprayable < 10
      } else {
        return true
      }
    },
    message: "Number of sprayable structures seems high. Please check the value.",
    type: "warning",
    relevant_questions: ["number_sprayable", "sprayable"]
  }
]
