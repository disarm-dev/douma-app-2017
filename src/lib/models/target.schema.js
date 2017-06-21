import schema from 'js-schema'

export const TargetSchema = schema({
  id: [String, Number],
  '?number_of_structures': [Number, null],
  '?number_of_households': [Number, null]
})
