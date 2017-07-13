import series from 'es6-promise-series'
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
    create_records: async (context, records) => {
      const max_records_in_batch = 30

      // Batch creating of records
      const results = []
      while (records.length > 0) {
        const records_batch = records.splice(0, max_records_in_batch)
        let result 
        try {
          result = await create_records(records_batch)
        } catch (e) {
          result = e
        }
        results.push(result)
      }
      // TODO: @feature Actually filter batches here
      const successfully_synced_record_batches = results.filter(() => true)

      // Flatten array

      //  Mark each one as synced
    },
    clear_synced_responses: (context) => {
      let synced_responses = context.state.responses.filter(r => r.synced)

      synced_responses.forEach((response) => {
        context.commit('delete_response', response)
      })
    }
  }
}
