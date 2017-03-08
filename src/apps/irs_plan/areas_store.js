import union from '@turf/union'
import difference from '@turf/difference'

export default {
  namespaced: true,
  state: {
    selected_command: 'result',
    informal_draw_stack: []
  },
  mutations: {
    'push_informal_draw_stack': (state, stack_action) => {
      state.informal_draw_stack.push(stack_action)
    },
    'set_selected_command': (state, command) => {
      if (state.selected_command === command) command = null
      state.selected_command = command
    }
  },
  actions: {
    'informal_draw_add': (context, feature) => {
      const stack_action = { type: 'add', feature: feature }
      context.commit('push_informal_draw_stack', feature)
    },
    'informal_draw_subtract': (context, feature) => {
      const stack_action = { type: 'subtract', feature: feature }
      context.commit('push_informal_draw_stack', feature)
    }
  },
  getters: {
    formal_bulk_result: (state) => {

    },
    formal_single_result: (state) => {

    },
    informal_draw_stack_result: (state) => {
      // Add these all together in order
      return state.informal_draw_stack.reduce((sum, i) => sum + i.size, 0)
    },
    result_areas: (state) => {
      // Calculate the result from components
      return ['always something new', 'in here']
    }
  },
}