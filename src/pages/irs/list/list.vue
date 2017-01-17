<template>
  <div class="irs-list">
    <div class="md-title">Structures ({{structures.length}})</div>
    <md-list class="md-dense">
      <md-list-item  
        v-for="structure in structuresSortedByAction" 
        @click="setActiveStructure(structure._id)" 
        :class="{actioned: structure.actioned,  'not-actioned': !structure.actioned}">
        <md-icon>{{structure.actioned ? 'done'  : 'warning' }}</md-icon> <span>{{structure._id}}</span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        structures: this.$store.state.irs.structures
      }
    },
    computed: {
      structuresSortedByAction(){
        return this.structures.sort (o => !o.actioned)
      }
    },
    methods: {
      setActiveStructure(structureId) {
        // set active structures, so it can be rerendered on map
        if (this.$store.state.irs.mapRendered) {
          const event = new CustomEvent('selectList', { 'detail': structureId });
          document.dispatchEvent(event)
          console.log('dispath selectList', structureId)
        }

        this.$store.commit('irs:setActiveStructure', structureId)
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