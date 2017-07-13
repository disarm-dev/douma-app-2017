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
    create_records: (context, records) => {
      const max_records_in_batch = 30

      // Batch creating of records
      const promises = []
      while (records.length > 0) {
        const records_batch = records.splice(0, max_records_in_batch)
        const promise = create_records.bind(null, records_batch)
        // const promise = new Promise((resolve, reject) => {
        //   return create_records(records_batch).then(() => {
        //       records.forEach((record) => {
        //         record.synced = true
        //         context.commit('update_response', record)
        //       })
        //     }
        //   )
        // })
        promises.push(promise)
      }

      return series(promises, 1)
        .then((res) => console.log(res))
        .catch((err) => console.error(err))

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
