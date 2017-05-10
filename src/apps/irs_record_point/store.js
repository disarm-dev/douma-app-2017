export default {
  namespaced: true,
  state: {
    responses: []
  },
  mutations: {
    create_response: (state, response) => {
      state.responses.push(response)
    }
  }
}