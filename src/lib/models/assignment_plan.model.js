import array_unique from 'array-unique'
import get from 'lodash.get'

import {AssignmentSchema} from './assignment.schema'
import {AssignmentPlanSchema} from './assignment_plan.schema'
import {DECORATED_UNASSIGNED_TEAM} from 'apps/irs_tasker/unassigned_team'

export class AssignmentPlan {

  create({assignments, country}) {
    if (!AssignmentPlanSchema({assignments, country})) {
      console.error("AssignmentPlan failed validation")
      console.error(AssignmentPlanSchema.errors({assignments, country}))
    }

    return {assignments, country}
  }

  load_from_json(assignment_plan_json, plan_target_ids) {
    // Create assignments for every plan target, including those not already assigned in a plan
    const previous_assignments = get(assignment_plan_json, 'assignments', [])

    const assignments = plan_target_ids.map(target_id => {
      const found_assignment = previous_assignments.find(a => a.area_id === target_id)
      if (found_assignment) {
        return found_assignment
      } else {
        return {area_id: target_id, team_name: DECORATED_UNASSIGNED_TEAM.team_name}
      }
    })

    const teams = array_unique(assignments.map(assignment => assignment.team_name)).filter(i => i)
    return {assignments, teams}
  }

  extract_target_ids_from_plan(plan_json) {
    if (!plan_json.targets) return []

    return plan_json.targets.map(target => target.id)
  }
}
