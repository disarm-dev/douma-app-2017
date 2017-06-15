import schema from 'js-schema'

export const TargetSchema = schema({
  id: String,
  number_of_structures: [Number, null]
})
