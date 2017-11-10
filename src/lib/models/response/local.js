import {db} from 'lib/local_db'

export default class Local {
  constructor(applet_name) {
    this.table = db[applet_name + '/responses']
  }

  async read_all({personalised_instance_id, instance}) {
    const responses = await this.table.toArray()
    return responses.filter(r => {
      return r.instance_slug === instance && r.personalised_instance_id === personalised_instance_id
    })
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