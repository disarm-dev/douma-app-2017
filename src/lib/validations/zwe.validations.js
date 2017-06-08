export default [
  {
    name: 'total_sprayed',
    fn: (form_data) => {
      return true
    },
    message: 'Total sprayed does not equal `ddt`+ `deltamethrin`.',
    relevant_questions: ['sprayed'],
    type: "warning"
  }
]


