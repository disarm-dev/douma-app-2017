export default {
  state: {
    actions: [],
    tasks: [],
    activeAction: null
  },
  mutations: {
    "irs:setActiveAction": (state, action) => {
      state.activeAction = action
    },
  },
  actions: {
    "irs:setActiveActionByOSMId": (context, osm_id) => {
      let action = context.state.tasks.find(task => task.osm_id === osm_id)
      context.commit('irs:setActiveAction', action)
    },
    "irs:updateActiveAction": (context, actionClone) => {
      let originalActionIndex = context.state.tasks.findIndex(task => task.osm_id === actionClone.osm_id)

      if (originalActionIndex > -1) {
        // TODO: @feature Need to also persist to Kinto store somehow
        context.state.activeAction = actionClone
        context.state.tasks.splice(originalActionIndex, 1, actionClone)
      }

      // TODO @fix Replace magic number with proper solution
      setTimeout(() => {
        context.commit("irs:setActiveAction", null)
      }, 100)
    },
    "irs:reset": (state) => {
      state.tasks = []
      state.activeAction = null
    },
  }
}


// TODO: @feature Do we need a function that returns colours from text - e.g. for charts, etc?
// e.g. 'visited' => #70b170