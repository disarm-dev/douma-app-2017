// Store for 'IRS Plan' applet

import Sync from './data/sync.js'
import turfHelpers from '@turf/helpers'
import clone from 'clone'
import union from '@turf/union'
window.union = union

export default {
  state: {
    // DATA
    localities: [],
    selected_localities: [],
    clusters: [],
  },
  mutations: {
    'irs_plan:set_localities': (state, localities) => {
      state.localities = localities
    },  
    'irs_plan:set_clusters': (state, clusters) => {
      state.clusters = clusters
    },
    'irs_plan:set_selected_localities': (state, selected_localities) => {
      state.selected_localities = selected_localities
    }
  },
  actions: {
    'irs_plan:set_demo_instance_id': (context) => {
      Sync.config(context.rootState.meta.demo_instance_id)
    },
    'irs_plan:get_ous': (context, country_code) => {
      context.commit('irs_plan:set_localities', [])
      return Sync.get_ous(country_code).then((results) => {
        const localities = results.features
        context.commit('irs_plan:set_localities', localities)
        return Promise.resolve(localities)
      })
    },
    'irs_plan:get_clusters': (context) => {
      Sync.config(context.rootState.meta.demo_instance_id)
      return Sync.get_clusters()
    },
    'irs_plan:start_clustering': (context, country_code) => {
      const dist_km = 0.25
      const max_size = 50
      let polygons

      try {
        const just_geoms = context.state.selected_localities.map((l) => {
          return { geometry: l.geometry, type: l.type, properties: {} }
        })
        polygons = turfHelpers.featureCollection(just_geoms)

        // From Turf CHANGELOG for v3.0.1 (https://github.com/Turfjs/turf/blob/master/CHANGELOG.md)
        var merged = clone(polygons.features[0]), features = polygons.features;
        for (var i = 0, len = features.length; i < len; i++) {
          var poly = features[i]
          if (!poly.geometry) return
          try {
            merged = union(merged, poly)
          }
          catch (e) {
            console.log('Failed for', poly, 'with', e)
          }
        }

        polygons = turfHelpers.featureCollection(merged)
        // TODO: @refac Make sure API can accept `features` as a single object as well as an array
        // Create FeatureCollection by hand to ensure 'features' stays an array - required by the API?
        polygons.features = [polygons.features]
      }
      catch (e) {
        console.log('Using multiple polygons')
        polygons = {
          type: 'FeatureCollection',
          features: [context.state.selected_localities]
        }
      }

      return Sync.cluster_yourself({country_code, polygons, dist_km, max_size})
      .then(res => {
        context.commit("irs_plan:set_clusters", res)
        return res
    })
    } 
  }
}