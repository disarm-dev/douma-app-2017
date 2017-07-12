import array_unique from 'array-unique'
import without from 'lodash.without'

import {AssignmentSchema} from './assignment.schema'
import {AssignmentPlanSchema} from './assignment_plan.schema'
import {DECORATED_UNASSIGNED_TEAM} from 'apps/irs_tasker/unassigned_team'

export class AssignmentPlan {

  // assignments_from_plan(plan) {
  //   return plan.targets.map(target => {
  //     return this.create({
  //       area_id: target.id,
  //       team_name: target.assigned_to_team_name
  //     })
  //   })
  // }

  extract_target_ids_from_plan(plan_json) {
    if (!plan_json.targets) return []

    return plan_json.targets.map(target => target.id)
  }

  // create({area_id, team_name}) {
  //   const assignment = {area_id, team_name}
  //
  //   if (!assignment.team_name || assignment.team_name === '') {
  //     assignment.team_name = DECORATED_UNASSIGNED_TEAM.team_name
  //   }
  //
  //   if (!AssignmentSchema(assignment)) {
  //     console.error("AssignmentPlan failed validation")
  //     console.error(AssignmentSchema.errors(assignment))
  //   }
  //
  //   return assignment
  // }
  //
  // team_names_from_assignments(assignments) {
  //   const all_team_names = assignments.map(assignment => assignment.team_name)
  //   const unique_team_names = array_unique(all_team_names)
  //   const only_assigned = without(unique_team_names, 'Unassigned')
  //
  //   return only_assigned
  // }
}
