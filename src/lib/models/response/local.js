import {db} from 'lib/local_db'

export class Local {
  constructor(applet_name) {
    this.collection = db[applet_name + '/responses']
  }

  async read_all() {
    return await this.collection.toArray()
  }

  async create(response) {
    await this.collection.add(response)
  }

  async bulk_create(responses) {
    await this.collection.bulkAdd(responses)
  }
}