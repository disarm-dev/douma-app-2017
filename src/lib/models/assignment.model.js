import {AssignmentSchema} from './assignment.schema'

export class Assignment {
  assignments_from_plan(plan) {
    return plan.targets.map(target => {
      return this.create({
        area_id: target.id,
        team_name: target.assigned_to_team_name
      })
    }).filter(i => i)
  }

  create({area_id, team_name}) {
    const assignment = {area_id, team_name}
    if (AssignmentSchema(assignment)) {
      return assignment
    } else {
      console.error("Assignment failed validation")
      console.error(AssignmentSchema.errors(assignment))
      return null
    }
  }

  team_names_from_assignments(assignments) {
    return assignments.reduce((team_names, assignment) => {
      if (!team_names.includes(assignment.team_name) && assignment.team_name) {
        team_names.push(assignment.team_name)
      }
      return team_names
    }, [])
  }
}
