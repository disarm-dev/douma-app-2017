<template>
  <div class="irs-list">
    <div class="md-title">Entities (really Actions!) ({{sortedActions.length}})</div>
    <md-list class="md-dense">
      <md-list-item  
        v-for="action in sortedActions" 
        @click="setActiveAction(action)" 
        :class="{actioned: action.actioned,  'not-actioned': !action.actioned}">
        <md-icon>{{action.actioned ? 'done'  : 'warning' }}</md-icon> <span>{{action.id}}</span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
  export default {
    computed: {
      sortedActions(){
        return this.$store.state.irs.actions.sort(action => !action.actioned)
      }
    },
    methods: {
      setActiveAction(action) {
        this.$store.commit('irs:setActiveAction', action)
        this.$router.push({name: 'irs:form'})
      }
    }
  }
</script>

<style>
  .irs-list {
    max-width: 800px;
    margin: 1em auto;
    padding: 1em;
  }

  .actioned {
    color: green;
  }

  .not-actioned {
    color: red;
  }
</style>