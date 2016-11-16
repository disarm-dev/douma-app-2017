<template>
  <div class="irs-list">
    <div class="md-title">Structures ({{$store.state.irs.structures.length}})</div>
    <md-list class="md-dense">
      <md-list-item  v-for="structure in $store.state.irs.structures" @click="click(structure.id)" :class="{actioned: structure.actioned,  'not-actioned': !structure.actioned}">
        <md-icon>{{structure.actioned ? 'done'  : 'warning' }}</md-icon> <span>{{structure.id}}</span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
  export default {
    methods: {
      click(id) {
        this.$store.commit('setActiveIRSStructure', id)
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