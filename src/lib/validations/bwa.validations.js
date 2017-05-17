export default [
  {
    name: 'total_sprayed',
    fn: (form_data) => {
      return false
    },
    error_message: 'Total sprayed does not equl `ddt`+ `deltamethrin`.'
  }
]