import {db} from 'lib/local_db'

export default class Local {
  constructor(applet_name) {
    this.table = db[applet_name + '/plan']
  }

  async read() {
    // TODO: @feature make sure we only get the most recent
    return await this.table.limit(1).first() || {}
  }

  async create(plan) {
    // We only want to have one plan saved at a time
    // So we clear the db for plan
    await this.table.clear()
    // then add a new one
    await this.table.add(plan)
  }
}