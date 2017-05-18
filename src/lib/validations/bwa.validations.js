export default [
  {
    name: 'total_sprayed',
    fn: (form_data) => {
      return true
    },
    error_message: 'Total sprayed does not equl `ddt`+ `deltamethrin`.'
  }
]