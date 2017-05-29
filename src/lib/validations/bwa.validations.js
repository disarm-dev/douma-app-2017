export default [
  {
    name: 'total_sprayed',
    fn: (form_data) => {
      return true
    },
    message: 'Total sprayed does not equl `ddt`+ `deltamethrin`.',
    relevant_questions: ['total_sprayed', 'ddt', 'deltamethrin'],
    stopping_power: "soft",
  }
]




//
//
// `Relevant questions`
// `======`
//
// `↪️ Total sprayed:                    10` [total_sprayed, pageno 1]
// `↪️ Number sprayed with DDT:           6` [ddt, pageno 2]
// `↪️ Number sprayed with deltamethrin:  5` [deltamethrin, pageno 3]
