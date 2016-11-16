<template>
  <div>
    <div v-if="!$store.state.irs.active">
      <no-active-structure />
    </div>

    <div v-else class="form">
      <div class="md-title">Structure: {{$store.state.irs.active.id}}</div>

      <form novalidate @submit.stop.prevent="submit">

        <md-input-container>
          <label>Actioned by</label>
          <md-input v-model="person"></md-input>
        </md-input-container>

        <md-input-container>
          <label>Date</label>
          <md-input type="date" v-model="date"></md-input>
        </md-input-container>

        <md-input-container>
          <label>Time</label>
          <md-input type="time" v-model="time"></md-input>
        </md-input-container>
        
        <div>
          <md-checkbox v-model="actioned">Actioned?</md-checkbox>
        </div>

        <md-button v-model="actioned" @click="submit" type="submit" class="md-raised md-accent">Save</md-button>
      </form>
    </div>
  </div>
</template>

<script>
  import NoActiveStructure from '../../../components/no-active-structure.vue'

  export default {
    components: {
      NoActiveStructure
    },
    data() {
      return {
        person: 'Person A',
        date: new Date().toISOString().substring(0, 10),
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        actioned: this.$store.state.irs.active.actioned
      }
    },
    methods: {
      submit(e) {
        this.$router.push({name: 'irs:map'})
        this.$store.commit('actionStructure', this.$store.state.irs.active.id)

      }
    }
  }
</script>

<style scoped>
  .form {
    max-width: 800px;
    margin: 1em auto;
    padding: 1em;
  }
</style>