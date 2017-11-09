import {db} from 'lib/local_db'

export default class Local {
  constructor(applet_name) {
    this.table = db[applet_name + '/responses']
  }

  async read_all({personalised_instance_id, instance}) {
    return  await this.table.where({personalised_instance_id, instance_slug: instance}).toArray()
  }

  async create(response) {
    await this.table.add(response)
  }

  async update(response) {
    await this.table.put(response)
  }

  async create_or_update_bulk(responses) {
    await this.table.bulkPut(responses)
  }

  async remove_all() {
    await this.table.clear()
  }
}