<template>
  <div class="irs-list">
    <div class="md-title">Structures ({{structures.models.length}})</div>
    <md-list class="md-dense">
      <md-list-item  
        v-for="structure in structuresSortedByAction" 
        @click="setActiveStructure(structure)" 
        :class="{actioned: structure.actioned,  'not-actioned': !structure.actioned}">
        <md-icon>{{structure.actioned ? 'done'  : 'warning' }}</md-icon> <span>{{structure.id}}</span>
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
        return this.structures.models.sort (o => !o.actioned)
      }
    },
    methods: {
      setActiveStructure(structure) {
        this.$store.commit('irs:setActiveStructure', structure)
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