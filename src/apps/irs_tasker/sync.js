// Called by $store, coordinates local and remote activity
import LocalDB from '../../lib/local.js'
import RemoteDBClass from '../../lib/remote.js'
import IRSSync from '../irs/sync.js'

class Sync {
  constructor() {
    const demo_instance_id = localStorage.getItem('douma-demo-instance-id')
    this.RemoteDB = new RemoteDBClass(demo_instance_id)
  }

  get_clusters() {
    return IRSSync.get_clusters()
  }

  clear_clusters() {
    return LocalDB.clusters.clear()
  }

  update_cluster_local(cluster) {
    return LocalDB.clusters.update(cluster)
  }

  update_clusters_remote(clusters, options) {
    return this.RemoteDB.update_clusters(clusters)
  }
}

export default new Sync()