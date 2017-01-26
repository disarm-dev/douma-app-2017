export default {
  state: {
    actions: [],
    tasks: [],
    activeAction: null
  },
  mutations: {
    "irs:setActiveAction": (state, action) => {
      state.activeAction = action
    }
  },
  actions: {
    "irs:setActiveActionByOSMId": (context, osm_id) => {
      let action = context.state.actions.find(action => action.osm_id === osm_id)
      
      // TODO: @refac Want a better way to create a new Action? E.g. explicit `create` method
      // When we save, we can check for an existing action_id - if nothing, 
      // can add one - and then `create` rather than `update` the Action
      if (!action) action = {osm_id: osm_id}
      context.commit('irs:setActiveAction', action)
    },
    "irs:updateActiveAction": (context, actionClone) => {
      let originalActionIndex = context.state.tasks.findIndex(task => task.osm_id === actionClone.osm_id)

      if (originalActionIndex > -1) {
        context.state.tasks.splice(originalActionIndex, 1, actionClone)
        // TODO: @feature Need to also persist to Kinto store somehow
      }

    }
  }
}


// WHERE SHOULD WE PUT A FUNCTION THAT CREATES COLOURS FROM TEXT?
// e.g. 'visited' => #70b170