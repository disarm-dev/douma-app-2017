export default [
  {
    name: 'all_rooms_total_sprayed',
    fn: (f) => {
      // total sprayed must add up to total num_rooms
      if (f.all_rooms_sprayed === 'yes') {
        return f.num_rooms === (f.rooms_sprayed_ddt + f.rooms_sprayed_lambda)
      }
    },
    message: 'All rooms were sprayed but total sprayed does not add up to number of rooms.',
    relevant_questions: ['num_rooms', 'all_rooms_sprayed', 'rooms_sprayed_ddt', 'rooms_sprayed_lambda'],
    type: "warning",
  },
  {
    name: 'partial_rooms_sprayed',
    fn: (f) => {  
      // total sprayed must add up to total num_rooms - rooms not sprayed
      if (f.all_rooms_sprayed === 'no' && f.any_rooms_sprayed === 'yes') {
        return f.num_rooms === (f.rooms_sprayed + f.rooms_unsprayed)
      }
    },
    message: 'Total rooms must equal number of sprayed and unsprayed rooms.',
    relevant_questions: ['num_rooms', 'all_rooms_sprayed', 'any_rooms_sprayed', 'rooms_sprayed', 'rooms_unsprayed'],
    type: "warning",
  },
  {
    name: 'no_rooms_sprayed',
    fn: (f) => {  
      if (f.all_rooms_sprayed === 'no' && f.any_rooms_sprayed === 'no') {
        return false
      }
    },
    message: 'No rooms were recorded as sprayed.',
    relevant_questions: ['all_rooms_sprayed', 'any_rooms_sprayed'],
    type: "warning",
  },
  {
    name: 'rooms_types_sprayed',
    fn: (f) => {  
      if (f.any_rooms_sprayed === 'yes') {
        return f.rooms_sprayed === (f.modern_sprayed  + f.traditional_sprayed)
      }
    },
    message: 'Number of traditional rooms & modern rooms sprayed does not add up to total rooms sprayed.',
    relevant_questions: ['rooms_sprayed', 'any_rooms_sprayed', 'modern_sprayed', 'traditional_sprayed'],
    type: "warning",
  },
  {
    name: 'rooms_unsprayed',
    fn: (f) => {  
      if (f.all_rooms_sprayed === 'no') {
        return f.rooms_unsprayed === (f.rooms_locked + f.rooms_nobody + f.rooms_refused + f.rooms_baby + f.rooms_patient + f.rooms_funeral + f.rooms_kitchen + f.rooms_food + f.rooms_material + f.rooms_other)
      }
    },
    message: 'Reasons for rooms unsprayed does not add up to total number of rooms unsprayed.',
    relevant_questions: ["rooms_unsprayed", "all_rooms_sprayed" ,"rooms_locked", "rooms_nobody", "rooms_refused", "rooms_baby", "rooms_patient", "rooms_funeral", "rooms_kitchen", "rooms_food", "rooms_material", "rooms_other"],
    type: "warning",
  },
  {
    name: 'number_of_people',
    fn: (f) => {  
      return f.ppl_in_hs === (f.ppl_in_hs_under5 + f.ppl_in_hs_above5)
    },
    message: 'Reasons for rooms unsprayed does not add up to total number of rooms unsprayed.',
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
