// Called by $store, coordinates local and remote activity
import LocalDB from './local.js'
import RemoteDB from './remote.js'

export default {
  // Search
  search_clusters: () => {},
  
  // Cluster management (incl. Task sync)
  open_clusters: (clusters) => {},
  _open_cluster: (cluster) => {},
  close_clusters: (clusters) => {},
  _close_cluster: (cluster) => {},
  
  // Update task
  update_task: (task) => {},
  
  // Setting initial state for views
  set_clusters_from_local: () => {},
  set_tasks_spatial_entities_for_cluster: (cluster_id) => {}
}