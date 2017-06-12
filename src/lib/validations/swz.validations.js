export default [
  {
    name: 'more_sprayed_than_total',
    fn: (f) => f.number_of_structures_sprayed <= f.number_structures_total,
    message: 'There are more structures sprayed than total structures.',
    relevant_questions: ['number_of_structures_sprayed', 'number_structures_total'],
    type: "warning"
  },
  {
    name: 'total_sprayed',
    fn: (f) => (f.any_structures_unsprayed === 'no') &&  (f.number_structures_total === f.number_of_structures_sprayed),
    message: 'Total structures does not equal structures sprayed.',
    relevant_questions: ['number_of_structures_sprayed', 'number_structures_total', 'any_structures_unsprayed'],
    type: "warning"
  },
  {
    name: 'total_sprayed_and_unsprayed',
    fn: (f) => (f.any_structures_unsprayed === 'yes') && (f.number_structures_total === (f.number_of_structures_sprayed + f.n_rooms_baby + f.n_rooms_food + f.n_rooms_funeral + f.n_rooms_kitchen + f.n_rooms_locked + f.n_rooms_material + f.n_rooms_nobody + f.n_rooms_other + f.n_rooms_patient + f.n_rooms_refused)),
    message: 'Total structures does not equal structures sprayed and number of structures unsprayed.',
    relevant_questions: ['number_of_structures_sprayed', 'number_structures_total', 'any_structures_unsprayed', "n_rooms_baby", "n_rooms_food", "n_rooms_funeral", "n_rooms_kitchen", "n_rooms_locked", "n_rooms_material", "n_rooms_nobody", "n_rooms_other", "n_rooms_patient", "n_rooms_refused"],
    type: "warning"
  }
] 


