export default [
  {
    name: 'total_sprayed',
    fn: (form_data) => {
      return f.number_of_structures_sprayed + f.number_of_structures_unsprayed == f.number_structures_total
    },
    error_message: 'Total structures does not equal structures sprayed and unsprayed.'
  }
]