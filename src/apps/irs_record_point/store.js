import {controller} from './controller'

export default {
  namespaced: true,
  state: {
    responses: [],
    team_name: null,
  },
  mutations: {
    clear_data_storage: (state) => {
      state.team_name = null
      console.warn('Not clearing irs_record_point.responses - use localStorage.clear() if you really want')
    },
    create_response: (state, response) => {
      state.responses.push(response)
    },
    update_response: (state, response) => {
      let index = state.responses.findIndex((r) => r.id === response.id)
      state.responses.splice(index, 1, response)
    },
    mark_responses_as_synced: (state, responses) => {
      responses.forEach(response => {
        response.synced = true
        let index = state.responses.findIndex((r) => r.id === response.id)
        state.responses.splice(index, 1, response)
      })
    },
    add_responses: (state, responses) => {
      state.responses = state.responses.concat(responses)
    },
    delete_response: (state, response) => {
      let index = state.responses.findIndex((r) => r.id === response.id)
      state.responses.splice(index, 1)
    },
    delete_all_responses: (state) => {
      state.responses = []
    },
    set_team_name: (state, team_name) => {
      state.team_name = team_name
    }
  },
  actions: {
    create_records: async (context, records) => {
      controller.create_records(records).then((passed_records) => {
        context.commit('mark_responses_as_synced', passed_records)
      })
    },
    clear_synced_responses: (context) => {
      let synced_responses = context.state.responses.filter(r => r.synced)

      synced_responses.forEach((response) => {
        context.commit('delete_response', response)
      })
    }
  }
}
