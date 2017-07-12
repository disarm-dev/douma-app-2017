import array_unique from 'array-unique'
import without from 'lodash.without'

import {AssignmentSchema} from './assignment.schema'
import {AssignmentPlanSchema} from './assignment_plan.schema'
import {DECORATED_UNASSIGNED_TEAM} from 'apps/irs_tasker/unassigned_team'

export class AssignmentPlan {

  create_from_json(assignment_plan_json) {
    const assignments = assignment_plan_json.assignments || []
    const teams = array_unique(assignments.map(assignment => assignment.team_name)).filter(i => i)
    return {assignments, teams}
  }

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
