export default [
  {
    name: 'total_sprayed',
    fn: (form_data) => {
      return true
    },
    message: 'Total sprayed does not equl `ddt`+ `deltamethrin`.',
    stopping_power: "soft",
    input_questions: [],
    output_question: ''
  }
]


