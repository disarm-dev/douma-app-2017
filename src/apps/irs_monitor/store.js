import {get_all_records} from '@/lib/data/remote'

export default {
  namespaced: true,
  state: {
    responses: [],
    filters: []
  },
  mutations: {
    create_response: (state, response) => {
      state.responses.push(response)
    },
    update_response: (state, response) => {
      let index = state.responses.findIndex((r) => r.id === response.id)
      state.responses.splice(index, 1, response)
    },
    toggle_filter: (state, filter) => {
      let index = state.filters.findIndex(f => f.type === filter.type && f.value === filter.value)
      if (index === -1) {
        state.filters.push(filter)
      } else {
        state.filters.splice(index, 1)
      }
    },
    remove_filter: (state, type) => {
      state.filters = state.filters.filter((f) => {
        return f.type !== type
      })
    }
  },
  actions: {
    get_all_records: (context) => {
      const country = context.rootState.instance_config.slug
      return get_all_records(country)
    }
  }
}
