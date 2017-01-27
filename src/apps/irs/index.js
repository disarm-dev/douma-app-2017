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
    "irs:updateActiveAction": (state, actionClone) => {
      let originalActionIndex = state.tasks.findIndex(task => task.osm_id === actionClone.osm_id)

      if (originalActionIndex > -1) {
        // TODO: @feature Need to also persist to Kinto store somehow
        state.activeAction = actionClone
        state.tasks.splice(originalActionIndex, 1, actionClone)
      }
    },
    "irs:reset": (state) => {
      state.tasks = []
      state.activeAction = null
    },
  },
  actions: {
    "irs:setActiveActionByOSMId": (context, osm_id) => {
      let action = context.state.tasks.find(task => task.osm_id === osm_id)
      context.commit('irs:setActiveAction', action)
    },
  }
}


// TODO: @feature WHERE SHOULD WE PUT A FUNCTION THAT CREATES COLOURS FROM TEXT?
// e.g. 'visited' => #70b170