export default {
  state: {
    actions: [],
    activeAction: null
  },
  mutations: {
    "irs:setActiveAction": (state, action) => {
      state.activeAction = action
    }
  },
  actions: {
    "irs:setActiveActionById": (context, action_id) => {
      const action = context.state.actions.find(action => action.id === action_id)
      console.log(action)
      context.commit('irs:setActiveAction', action)
    }
  }
}