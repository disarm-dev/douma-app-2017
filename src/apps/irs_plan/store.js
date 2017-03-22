// Store for 'IRS Plan' applet

import Sync from './sync.js'
import IRSSync from '../irs/sync.js'
import {remove_properties} from '../../lib/map_helpers'

export default {
  state: {
    // DATA
    // localities: [],
    // areas_to_cluster: [],

    // INTERACTIVE CLUSTERING AREA SELECTION
    // manually_drawn_areas: {add: [], remove: []},
    // // manually_selected_areas: {add: [], remove: []},
    // map_mark_mode: null
  },
  mutations: {
    // 'irs_plan:set_localities': (state, localities) => {
    //   state.localities = localities
    // },
    // 'irs_plan:set_areas_to_cluster': (state, areas_to_cluster) => {
    //   state.areas_to_cluster = areas_to_cluster
    // },
    // 'irs_plan:map_mark_mode': (state, map_mark_mode) => {
    //   state.map_mark_mode = map_mark_mode
    // },
    // 'irs_plan:manually_add_area': (state, area) => {
    //   state.manually_selected_areas.add.push(area)
    // },
    // 'irs_plan:manually_remove_area': (state, area) => {
    //   state.manually_selected_areas.remove.push(area)
    // }
  },
  actions: {
    // 'irs_plan:set_demo_instance_id': (context) => {
    //   Sync.config(context.rootState.meta.demo_instance_id)
    // },
    // 'irs_plan:get_ous': (context, country_code) => {
    //   context.commit('root:set_loading', true)

    //   console.log('irs_plan:get_ous')
    //   return Sync.get_ous(country_code).then((results) => {
    //     context.commit('irs_plan:set_localities', [])
  
    //     const localities = results.features
    //     const max = localities.reduce((max, i) => {return i.properties.MeanElev > max ? i.properties.MeanElev : max}, 0)

    //     const non_zero_elev_localities = localities.map(l => {
    //       if (l.properties.MeanElev == 0) l.properties.MeanElev = max
    //       return l
    //     })

    //     context.commit('root:set_loading', false)
    //     context.commit('irs_plan:set_localities', non_zero_elev_localities)
    //     return Promise.resolve(non_zero_elev_localities)
    //   }).catch(err => console.error(err))
    // },
    // 'irs_plan:start_clustering': (context, country_code) => {
    //   console.log(context.state.areas_to_cluster)
    //   return 
    //   const dist_km = 0.25
    //   const max_size = 50

    //   let polygons = {
    //     type: 'FeatureCollection', 
    //     features: context.state.areas_to_cluster
    //   }

    //   polygons = remove_properties(polygons)
    //   context.commit('root:set_loading', true)
    //   return Sync.cluster_yourself_pbf({country_code, polygons, dist_km, max_size})
    //     .then(res => {
    //       context.commit('root:set_loading', false)
    //       context.commit("irs:set_clusters", res)
    //       return res
    //     })
    // },
    // 'irs_plan:post_clusters': (context) => {
    //   const clusters = context.rootState.irs.clusters
    //   const demo_instance_id = context.rootState.meta.demo_instance_id
    //   context.commit('root:set_loading', true)
    //   return Sync.post_clusters(clusters).then(() => {
    //     context.commit('root:set_loading', false)
    //     context.commit('irs:set_clusters', []) // TODO: @debug Remove
    //     return context.dispatch('irs:get_clusters')
    //   })
    // }
  }
}