// Store for 'IRS Record' applet

import Sync from './sync.js'

export default {
  state: {
    // EDITING

    // DATA
    clusters: [],
    tasks: [],
    saved_cluster_ids: [],

    // STATE-STATE
    clusters_search_results: []
  },
  mutations: {
    // EDITING

    // DATA
    "irs_record:set_clusters": (state, clusters) => {
      state.clusters = clusters
    },
    'irs_record:set_saved_clusters': (state, cluster_ids) => {
      state.saved_cluster_ids = cluster_ids
    },
    "irs_record:set_tasks": (state, tasks) => {
      state.tasks = tasks
    },
    "irs_record:set_spatial_entities": (state, spatial_entities) => {
      state.spatial_entities = spatial_entities
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
      context.commit("root:set_loading", true)

      return Sync.search_clusters(locations)
        .then((res) => {
          context.commit("root:set_loading", false)
          return res
        })
        .catch((e) => console.error(e))
    },
    "irs_record:set_clusters_from_local": (context) => {
      return Sync.read_local_clusters({}).then((result) => {
        return new Promise((resolve, reject) => {
          resolve(context.commit("irs_record:set_clusters", result))
        })
      })
    },
    'irs_record:load_saved_clusters': (context) => {
      context.commit('irs_record:set_saved_clusters', (JSON.parse(localStorage.getItem('douma-saved-cluster-ids'))|| []))
    },
    "irs_record:open_clusters": (context, clusters) => {
      context.commit("root:set_loading", true)

      return Sync.open_clusters(clusters).then(() => {
        context.commit("root:set_loading", false)
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
      const all_clusters = context.state.clusters.filter(c => this.saved_cluster_ids.includes(c._id))

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