import {PlanSchema} from './plan.schema'

export class Plan {
  constructor(properties) {
    const plan = {
      planned_at: new Date(),
      ...properties
    }

    const errors = PlanSchema.errors(plan)

    if (errors) {
      console.table(errors)
      throw new Error('PlanSchema validation failed')
    }

    return plan
  }
}
