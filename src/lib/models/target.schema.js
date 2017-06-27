import schema from 'js-schema'

export const TargetSchema = schema({
  id: [String, Number],
  assigned_to_team_name: [String, null],
  '?number_of_structures': [Number, null],
  '?number_of_households': [Number, null]
})
