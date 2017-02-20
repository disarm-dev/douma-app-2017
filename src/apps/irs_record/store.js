// Store for 'IRS Record' applet

import turf from '@turf/turf'
import Sync from './data/sync.js'

export default {
  state: {
    // EDITING

    // DATA
    clusters: [],
    tasks: [],

    // SYNC
    sync_in_progress: false,

    // STATE-STATE
    clusters_search_results: []
  },
  mutations: {
    // EDITING

    // DATA
    "irs_record:set_clusters": (state, clusters) => {
      state.clusters = clusters
    },
    "irs_record:set_tasks": (state, tasks) => {
      state.tasks = tasks
    },
    "irs_record:set_spatial_entities": (state, spatial_entities) => {
      state.spatial_entities = spatial_entities
    },

    // SYNC
    "irs_record:set_sync_in_progress": (state, sync_state) => {
      state.sync_in_progress = !!(sync_state)
    },

    // STATE-STATE
    "irs_record:set_clusters_search_results": (state, clusters_search_results) => {
      state.clusters_search_results = clusters_search_results
    }
    
  },
  actions: {
    // SYNC
    "irs_record:configure_sync": (context, demo_instance_id) => {
      Sync.config(demo_instance_id)
    },
    "irs_record:search_clusters": (context, locations) => {
      context.commit("irs_record:set_sync_in_progress", true)

      return Sync.search_clusters(locations)
        .then((res) => {
          context.commit("irs_record:set_sync_in_progress", false)
          return res
        })
        .catch((e) => console.error(e))
    },
    "irs_record:set_clusters_from_local": (context, spray_team_id) => {
      // spray_team_id = 3
      return Sync.read_local_clusters({spray_team_id}).then((result) => {
        return new Promise((resolve, reject) => {
          resolve(context.commit("irs_record:set_clusters", result))
        })
      })
    },
    "irs_record:open_clusters": (context, clusters) => {
      context.commit("irs_record:set_sync_in_progress", true)

      Sync.open_clusters(clusters).then(() => {
        context.commit("irs_record:set_sync_in_progress", false)
        return context.dispatch('irs_record:set_clusters_from_local')
      }).catch(error => console.error(error))
    },

    "irs_record:close_cluster": (context, cluster) => {
      return Sync.close_cluster(cluster).then(() => {
        return context.dispatch('irs_record:set_clusters_from_local')
      })
    },

    "irs_record:clear_local_dbs": (context) => {
      Sync.clear_local_dbs()
      .then(() => {
        context.commit("irs_record:set_clusters", null)
        context.commit("irs_record:set_tasks", null)
        context.commit("irs_record:set_spatial_entities", null)
      })
    },
    "irs_record:set_tasks_for_cluster": (context, cluster_id) => {

      const cluster = context.state.clusters.find(cluster => cluster._id === cluster_id)

      if (!cluster) throw new Error(`Cannot find Cluster for id ${cluster_id} - have you navigated to view a Cluster that does not exist?`)

      return Sync.get_tasks_for_cluster(cluster)
        .then((tasks) => {
          context.commit("irs_record:set_tasks", tasks)
      })

    },
    "irs_record:update_task": (context, task) => {
      task._sync_status = 'unsynced'
      return Sync.update_task(task)
    },
    "irs_record:sync_tasks": (context, tasks) => {
      return Sync.sync_tasks(tasks)
    },
    "irs_record:get_unsynced_tasks_for_cluster": (context) => {
      const all_clusters = context.state.clusters

      const promises = all_clusters.map((cluster) => {
        return Sync.get_unsynced_tasks_for_cluster(cluster)
      })

      return Promise.all(promises).then((results) => {
        let clusters_with_sync_counts = []

        results.forEach((result) => {
          let cluster = all_clusters.find(c => c._id === result.cluster_id)
          cluster.unsynced_tasks = result.unsynced_tasks
          clusters_with_sync_counts.push(cluster)
        })
        return clusters_with_sync_counts
      })
    }
  },

}