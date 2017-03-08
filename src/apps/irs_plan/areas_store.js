import Sync from './sync'

import union from '@turf/union'
import difference from '@turf/difference'

export default {
  state: {
    // State state
    selected_command: 'result',
    show_preview: false,

    // Data
    formal_areas: [],
    informal_draw_stack: []
  },
  mutations: {
    'irs_areas:set_show_preview': (state, show_preview) => {
      state.show_preview = show_preview
    },
    'irs_areas:set_selected_command': (state, command) => {
      if (state.selected_command === command) command = null
      state.selected_command = command
    },
    'irs_areas:set_formal_areas': (state, formal_areas) => {
      state.formal_areas = formal_areas
    },
    'irs_areas:push_informal_draw_stack': (state, stack_action) => {
      state.informal_draw_stack.push(stack_action)
    },
  },
  actions: {
    'irs_areas:informal_draw_add': (context, feature) => {
      const stack_action = { type: 'add', feature: feature }
      context.commit('irs_areas:push_informal_draw_stack', feature)
    },
    'irs_areas:informal_draw_subtract': (context, feature) => {
      const stack_action = { type: 'subtract', feature: feature }
      context.commit('irs_areas:push_informal_draw_stack', feature)
    },
    'irs_areas:load_formal_areas': (context, country_code) => {
      context.commit('root:set_loading', true)
      console.log('load_formal_areas')

      return Sync.get_ous(country_code).then((results) => {
        context.commit('irs_areas:set_formal_areas', [])
  
        const localities = results.features
        const max = localities.reduce((max, i) => {return i.properties.MeanElev > max ? i.properties.MeanElev : max}, 0)

        const non_zero_elev_localities = localities.map(l => {
          if (l.properties.MeanElev == 0) l.properties.MeanElev = max
          return l
        })

        context.commit('root:set_loading', false)
        context.commit('irs_areas:set_formal_areas', non_zero_elev_localities)
        return Promise.resolve(non_zero_elev_localities)
      }).catch(err => console.error(err))
    }
  },
  getters: {
    'irs_areas:formal_bulk_result': (state) => {

    },
    'irs_areas:formal_single_result': (state) => {

    },
    'irs_areas:informal_draw_stack_result': (state) => {
      // Calculate result of informal_draw_stack
      return state.informal_draw_stack.reduce((sum, i) => sum + i.size, 0)
    },
    'irs_areas:result_areas': (state) => {
      // Calculate the result from:
      // 
      // formal_bulk_result  formal_single_result
      // MINUS informal stack removed areas
      // PLUS informal stack add areas
      return ['always something new', 'in here']
    }
  },
}