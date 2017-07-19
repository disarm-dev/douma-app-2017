import clonedeep from 'lodash.clonedeep'

import CONFIG from 'config/common'
import {create_records} from 'lib/remote/remote.records'

export default {
  namespaced: true,
  state: {
    responses: [],
    team_name: null
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
      const max_records_in_batch = CONFIG.remote.max_records_batch_size

      // Clone so we can easily splice. response_id ensures updating works
      const records_left = clonedeep(records)

      // Batch creating of records
      const results = {pass: [], fail: []}

      while (records_left.length > 0) {
        const records_batch = records_left.splice(0, max_records_in_batch)

        await create_records(records_batch)
          .then((passed_records) => {
            // Set synced status for successfully-synced records
            context.commit('mark_responses_as_synced', passed_records)
            results.pass.push(passed_records)
          })
          .catch((failed_records) => {
            results.fail.push(failed_records)
          })
      }

      // Return the results array
      return results
    },
    clear_synced_responses: (context) => {
      let synced_responses = context.state.responses.filter(r => r.synced)

      synced_responses.forEach((response) => {
        context.commit('delete_response', response)
      })
    }
  }
}
