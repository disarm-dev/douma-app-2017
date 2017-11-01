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

  async create_bulk(responses) {
    await this.table.bulkPut(responses)
  }

  async remove_all() {
    await this.table.clear()
  }
}