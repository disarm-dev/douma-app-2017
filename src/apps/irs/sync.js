// Sync logic shared across IRS applets
import LocalDB from '../../lib/local.js'
import RemoteDBClass from '../../lib/remote.js'

class IRSSync  {
  get_clusters({demo_instance_id, force_remote_refresh}) {
    return LocalDB.clusters.read({demo_instance_id}).then((clusters) => {
      if (clusters.length === 0) {
        const RemoteDB = new RemoteDBClass(demo_instance_id)
        let clusters_cache

        return RemoteDB.read_clusters({})
        .then((clusters) => {
          clusters_cache = clusters.map(cluster => {
            cluster._sync_status = 'synced'
          })
          return LocalDB.clusters.create(clusters).then(() => {
              return Promise.resolve(clusters)
          })
        })
        .then(() => clusters_cache)
      } else {
        return clusters
      }
    })
  }

  update_clusters(clusters) {
    return LocalDB.clusters.create(clusters)
  }

  delete_clusters(clusters) {
    return this.RemoteDB.delete_clusters().then(() => {
      return LocalDB.clusters.clear()
    })
  }


}

export default new IRSSync()