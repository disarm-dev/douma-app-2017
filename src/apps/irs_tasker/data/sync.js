// Called by $store, coordinates local and remote activity
import LocalDB from '../../../lib/local.js'
import RemoteDBClass from '../../../lib/remote.js'

class Sync {

  config(team_id) {
    this.RemoteDB = new RemoteDBClass(team_id)
    this.team_id = team_id
  }

  // Load local clusters
  load_clusters() {
    return LocalDB.clusters.read()
  }

  // Get all clusters from remote
  get_clusters() {
    // let clusters_cache

    return this.RemoteDB.read_clusters({})
    // .then((clusters) => {
    //   clusters_cache = clusters
    //   return LocalDB.clusters.create(clusters)
    // }).then(() => {
    //   return clusters_cache
    // }).catch((problem) => {
    //   console.log('Error fetching get_clusters, might be pre-existing Clusters in LocalDB')
    // })
  }

  clear_clusters() {
    return LocalDB.clusters.clear()
  }

  update_clusters(clusters) {
    // return this.RemoteDB.clusters.update(clusters)
  }
}

export default new Sync()