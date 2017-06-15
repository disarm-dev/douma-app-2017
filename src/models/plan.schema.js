import schema from 'js-schema'

import {TargetSchema} from './target.schema.js'

export const PlanSchema = schema({
  planned_at: String,
  country: String,
  targets: Array.of_x(1, Infinity, TargetSchema)
})
