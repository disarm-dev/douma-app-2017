import {create_record} from '@/lib/data/remote'

export default {
  namespaced: true,
  state: {
    responses: []
  },
  mutations: {
    create_response: (state, response) => {
      state.responses.push(response)
    },
    update_response: (state, response) => {
      let index = state.responses.findIndex((r) => r.id === response.id)
      state.responses.splice(index, 1, response)
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
    create_record: (context, record) => {
      // TODO: @feature Maybe test this before using it?
      return create_record(record)
    }
  }
}
