export default [
  {
    name: 'total_sprayed',
    fn: (f) => { // f is form_data
      return f.numbersprayed_ddt + f.numbersprayed_delta == f.number_sprayable
    },
    error_message: 'Total sprayed does not equal `ddt`+ `deltamethrin`.'
  }
]