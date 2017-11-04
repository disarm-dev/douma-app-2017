import clonedeep from 'lodash.clonedeep'

import CONFIG from 'config/common'
import { ResponseController } from 'lib/models/response/controller'

const controller = new ResponseController('record')

export default {
  namespaced: true,
  unpersisted_state_keys: ['responses'],
  state: {
    responses: [],

    // Not pure metadata, but we want to persist between each form entry
    persisted_metadata: {}
  },
  mutations: {
    clear_data_storage: (state) => {
      state.team_name = null
      console.warn('Not clearing irs_record_point.responses - use localStorage.clear() if you really want')
    },
    set_responses: (state, responses) => {
      state.responses = responses
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

    set_persisted_metadata: (state, {name, value}) => {
      const new_metadata = {...state.persisted_metadata, [name]: value}
      state.persisted_metadata = new_metadata
    },
    set_team_name: (state, team_name) => {
      state.persisted_metadata.team_name = team_name
    },
    set_category: (state, category) => {
      state.persisted_metadata.category = category
    }
  },
  actions: {
    create_response_local: async (context, response) => {
      try {
        await controller.create_local(response)
        context.commit('create_response', response)
        context.commit('root:set_snackbar', {message: 'Created record'}, {root: true})
      } catch (e) {
        console.error(e)
        context.commit('root:set_snackbar', {message: 'Could not save record locally'}, {root: true})
      }
    },
    update_response_local: async (context, response) => {
      try {
        await controller.update_local(response)
        context.commit('update_response', response)
        context.commit('root:set_snackbar', {message: 'Updated record'}, {root: true})
      } catch (e) {
        console.error(e)
        context.commit('root:set_snackbar', {message: 'Could not update record locally'}, {root: true})
      }
    },
    create_records: async (context, records) => {
      // TODO: @refac DEFINITELY put batching inside the controller!
      const max_records_in_batch = CONFIG.remote.max_records_batch_size

      // Clone so we can easily splice. response_id ensures updating works
      const records_left = clonedeep(records)

      // Batch creating of records
      const results = {pass: [], fail: []}

      while (records_left.length > 0) {
        const records_batch = records_left.splice(0, max_records_in_batch)

        await controller.create_batch_network(records_batch)
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
    read_records: async (context) => {
      const retrieved_responses = await controller.read_all_cache()
      context.commit('set_responses', retrieved_responses)
    }
  }
}
