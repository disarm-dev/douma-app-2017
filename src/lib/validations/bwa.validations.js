export default [
  {
    name: 'all_rooms_total_sprayed',
    fn: (f) => f.all_rooms_sprayed === 'yes' &&  (f.num_rooms === (f.rooms_sprayed_ddt + f.rooms_sprayed_lambda)),
    message: 'All rooms were sprayed but total sprayed does not add up to number of rooms.',
    relevant_questions: ['num_rooms', 'all_rooms_sprayed', 'rooms_sprayed_ddt', 'rooms_sprayed_lambda'],
    type: "warning",
  },
  {
    name: 'partial_rooms_sprayed',
    fn: (f) => (f.all_rooms_sprayed === 'no' && f.any_rooms_sprayed === 'yes') && (f.num_rooms === (f.rooms_sprayed + f.rooms_unsprayed)),
    message: 'Total rooms must equal number of sprayed and unsprayed rooms.',
    relevant_questions: ['num_rooms', 'all_rooms_sprayed', 'any_rooms_sprayed', 'rooms_sprayed', 'rooms_unsprayed'],
    type: "warning",
  },
  {
    name: 'rooms_unsprayed',
    fn: (f) => (f.all_rooms_sprayed === 'no')  && ( f.rooms_unsprayed === (f.rooms_locked + f.n_rooms_nobody + f.n_rooms_refused + f.n_rooms_baby + f.n_rooms_patient + f.n_rooms_funeral + f.n_rooms_kitchen + f.n_rooms_food + f.n_rooms_material + f.n_rooms_other)),
    message: 'Reasons for rooms unsprayed does not add up to total number of rooms unsprayed.',
    relevant_questions: ["rooms_unsprayed", "all_rooms_sprayed" ,"rooms_locked", "n_rooms_nobody", "n_rooms_refused", "n_rooms_baby", "n_rooms_patient", "n_rooms_funeral", "n_rooms_kitchen", "n_rooms_food", "n_rooms_material", "n_rooms_other"],
    type: "warning",
  },
  {
    name: 'rooms_types_sprayed',
    fn: (f) => (f.any_sprayed === 'yes') && (f.number_sprayed === (f.number_sprayed_modern_partial_spray  + f.number_sprayed_traditional_partial_spray)),
    message: 'Number of traditional rooms & modern rooms sprayed does not add up to total rooms sprayed.',
    relevant_questions: ['any_sprayed', 'number_sprayed', 'number_sprayed_modern_partial_spray', 'number_sprayed_traditional_partial_spray'],
    type: "warning",
  },
  {
    name: 'number_of_rooms',
    fn: (f) => f.room_count === (f.number_rooms_modern + f.number_rooms_traditional),
    message: 'Total number of rooms does not add up.',
    relevant_questions: [ "room_count", "number_rooms_modern", "number_rooms_traditional"],
    type: "warning",
  },
  {
    name: 'number_of_people',
    fn: (f) => f.ppl_in_hs === (f.ppl_in_hs_under5 + f.ppl_in_hs_above5),
    message: 'Number of people does not add up.',
    relevant_questions: [ "ppl_in_hs", "ppl_in_hs_under5", "ppl_in_hs_above5"],
    type: "warning",
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
