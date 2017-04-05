// Sync logic shared across IRS applets
import LocalDB from '../../lib/local.js'
import RemoteDBClass from '../../lib/remote.js'

class IRSSync  {
  // TODO: @feature Check remote if Clusters have changed, and refresh from remote if necessary
  get_clusters({demo_instance_id, force_remote_refresh}) {
    return LocalDB.clusters.read({demo_instance_id}).then((clusters) => {
      if (clusters.length === 0) {
        const RemoteDB = new RemoteDBClass(demo_instance_id)
        let clusters_cache

        return RemoteDB.read_clusters({})
        .then((clusters) => {
          clusters_cache = clusters.map(cluster => {
            cluster._sync_status = 'synced'
            return cluster
          })
          return LocalDB.clusters.create(clusters_cache).then(() => {
              return Promise.resolve(clusters_cache)
          })
        })
      } else {
        return clusters
      }
    })
  }

  update_cluster_local(cluster) {
    return LocalDB.clusters.update(cluster)
  }

  update_clusters_remote(clusters, options) {
    const RemoteDB = new RemoteDBClass(options.demo_instance_id)
    return RemoteDB.update_clusters(clusters)
  }

  delete_clusters(demo_instance_id) {
    const RemoteDB = new RemoteDBClass(demo_instance_id)
    return RemoteDB.delete_clusters().then(() => {
      return LocalDB.clusters.clear()
    })
  }


}

export default new IRSSync()