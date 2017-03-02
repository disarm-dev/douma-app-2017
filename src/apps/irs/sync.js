// Sync logic shared across IRS applets
import LocalDB from '../../lib/local.js'
import RemoteDBClass from '../../lib/remote.js'

const IRSSync = {
  get_clusters({demo_instance_id, force_remote_refresh}) {
    if (!force_remote_refresh) {
      return LocalDB.clusters.read({demo_instance_id})
    } else {
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
    }
    // If Clusters, then return Clusters (??and trigger a background refresh)
    // If no Clusters, then trigger a background/foreground refresh
    // When refresh complete, notify user and ask if they want to update

    // let clusters_cache
    // this.RemoteDB = new RemoteDBClass(demo_instance_id)
    // return this.RemoteDB.read_clusters({})
    // .then((clusters) => {
    //   clusters_cache = clusters
    //   return LocalDB.clusters.create(clusters)
    // }).then(() => {
    //   return clusters_cache
    // }).catch((problem) => {
    //   console.log('Error fetching get_clusters, might be pre-existing Clusters in LocalDB')
    // })
  },
  // _background_refresh(){
  //   return this.RemoteDB.count_clusters({})
  //   .then((clusters) => {
  //     // Check whenther Clusters count has changed // TODO: @feature For more consistency, could check whether IDs are different instead.
  //     return clusters
  //   })
  // },

  // _notify_user() {

  // }
  update_clusters(clusters) {
    return LocalDB.clusters.create(clusters)
  }


}
export default IRSSync