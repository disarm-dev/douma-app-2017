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
      console.log(action)
      context.commit('irs:setActiveAction', action)
    },
    "irs:updateActiveAction": (context, actionClone) => {
      console.log('updateActiveAction', actionClone)
      // If actionClone has an action_id then find the existing action in Actions by ID
      // Then `update` the Actions array <<<=== OR TASKS?
      // Otherwise `create` a new Action (should get an ID from kinto-js)
    }
  }
}


// WHERE SHOULD WE PUT A FUNCTION THAT CREATES COLOURS FROM TEXT?
// e.g. 'visited' => #70b170