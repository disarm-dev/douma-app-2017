import {create_records} from 'lib/data/remote'

export default {
  namespaced: true,
  state: {
    responses: []
  },
  mutations: {
    clear_data_storage: (state) => {
      state.responses = []
    },
    create_response: (state, response) => {
      state.responses.push(response)
    },
    update_response: (state, response) => {
      let index = state.responses.findIndex((r) => r.id === response.id)
      state.responses.splice(index, 1, response)
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
    }
  },
  actions: {
    create_records: (context, records) => {
      return create_records(records)
    },
    clear_synced_responses: (context) => {
      let synced_responses = context.state.responses.filter(r => r.synced)

      synced_responses.forEach((response) => {
        context.commit('delete_response', response)
      })
    }
  }
}
