export default [
  {
    name: 'total_sprayed',
    fn: (f) => {
      return f.number_of_structures_sprayed <= f.number_structures_total
    },
    message: 'Number of sprayed structures is larger than total structures.',
    relevant_questions: ['number_of_structures_sprayed', 'number_structures_total'],
    type: "warning"
  },
  {
    name: 'total_sprayed',
    fn: (f) => {
      // fix this one
      return f.number_of_structures_sprayed <= f.number_structures_total
    },
    message: 'Total structures does not equal structures sprayed and unsprayed.',
    relevant_questions: ['number_of_structures_sprayed', 'number_structures_total'],
    type: "warning"
  },
  {
    name: 'total_sprayed',
    fn: (f) => {
      if (f.number_of_structures_unsprayed === 'no') {
        return  f.number_structures_total === f.number_of_structures_sprayed
      }
    },
    message: 'Total structures does not equal structures sprayed and unsprayed.',
    relevant_questions: ['number_of_structures_sprayed', 'number_structures_total'],
    type: "warning"
  }
]
