export default [
  { 
    name: 'total_sprayed',
    fn: (f) => {
      return f.numbersprayed_ddt + f.numbersprayed_delta == f.number_sprayable
    },
    message: 'Total sprayed does not equal `ddt`+ `deltamethrin`.',
    stopping_power: "hard",
    input_questions: ["numbersprayed_ddt", "numbersprayed_delta"],
    output_question: "number_sprayable"
  },
  {
    name: 'sprayable_unsprayed',
    fn: (f) => {
      if (f.sprayable_unsprayed == 'yes') {
        return f.numbersprayed_ddt + f.numbersprayed_delta + f.number_unsprayed == f.number_sprayable
      } else {
        return false
      }
    },
    message: "Number of unsprayed structures doesn't add up",
    stopping_power: "soft",
    input_questions: ["numbersprayed_ddt", "numbersprayed_delta", "number_unsprayed", "sprayable_unsprayed"],
    output_question: "number_sprayable"
  }
]