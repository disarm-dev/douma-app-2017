// Called by $store, coordinates local and remote activity
import LocalDB from '../../lib/local.js'
import RemoteDBClass from '../../lib/remote.js'
import IRSSync from '../irs/sync.js'

class Sync {

  config(demo_instance_id) {
    this.RemoteDB = new RemoteDBClass(demo_instance_id)
    this.demo_instance_id = demo_instance_id
  }

  get_clusters() {
    return IRSSync.get_clusters()
  }

  clear_clusters() {
    return LocalDB.clusters.clear()
  }

  update_clusters(clusters) {
    return this.RemoteDB.update_clusters(clusters)
  }
}

export default new Sync()