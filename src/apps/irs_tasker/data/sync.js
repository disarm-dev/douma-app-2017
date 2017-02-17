// Called by $store, coordinates local and remote activity
import LocalDB from './local.js'
import RemoteDBClass from './remote.js'

class Sync {

  config(team_id) {
    this.RemoteDB = new RemoteDBClass(team_id)
    this.team_id = team_id
  }

  // Get all clusters
  get_clusters() {
    this.RemoteDB.read_clusters()
  }
}

export default new Sync()