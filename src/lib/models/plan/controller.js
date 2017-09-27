import remote from './remote'
import Local from './local'

export class PlanController {
  constructor(applet_name) {
    this.local = new Local(applet_name)
  }

  async read_plan_current_network() {
    return await remote.read_plan_current()
  }

  async read_plan_current_local() {
    return await this.local.read()
  }

  async create_plan(plan){
    await this.local.create(plan)
    return await remote.create_plan(plan)
  }
}


