import {db} from 'lib/local_db'

export default class Local {
  constructor(applet_name) {
    this.table = db[applet_name + '/responses']
  }

  async read_all() {
    return await this.table.toArray()
  }

  async create(response) {
    await this.table.add(response)
  }

  async bulk_create(responses) {
    await this.table.bulkAdd(responses)
  }
}