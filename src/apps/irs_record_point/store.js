export default {
  namespaced: true,
  state: {
    responses: [],
    current_response: null
  },
  mutations: {
    create_response: (state, response) => {
      state.responses.push(response)
    },
    update_response: (state, response) => {
      
    }
  }
}