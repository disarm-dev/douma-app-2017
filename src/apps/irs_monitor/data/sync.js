// Called by $store, coordinates local and remote activity
import LocalDB from '../../../lib/local.js'
import RemoteDBClass from '../../../lib/remote.js'

class Sync {

  config(team_id) {
    this.RemoteDB = new RemoteDBClass(team_id)
    this.team_id = team_id
  }

  // Get all clusters
  get_clusters() {
    return this.RemoteDB.read_clusters({})
  }

  get_tasks() {
    return this.RemoteDB.read_tasks({})
  }
}

export default new Sync()