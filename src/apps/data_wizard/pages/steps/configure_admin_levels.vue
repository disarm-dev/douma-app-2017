<template>
  <md-card class="card">
    <md-card-header>
      <div class="md-title">Select admin levels to include</div>
    </md-card-header>
    <md-card-content>
      <md-list>
        <md-list-item>
          <span><b>Admin level</b></span>
          <div><b>Include</b></div>
          <div><b>Planning level</b></div>
        </md-list-item>

        <md-list-item>
          <span>Admin 1</span>
          <md-checkbox v-model="include_areas.one"></md-checkbox>

          <md-radio v-model="planning_level" md-value="one"></md-radio>
        </md-list-item>

        <md-list-item>
          <span>Admin 2</span>
          <md-checkbox v-model="include_areas.two"></md-checkbox>

          <md-radio v-model="planning_level" md-value="two"></md-radio>
        </md-list-item>

        <md-list-item>
          <span>Admin 3</span>
          <md-checkbox v-model="include_areas.three"></md-checkbox>

          <md-radio v-model="planning_level" md-value="three"></md-radio>
        </md-list-item>

        <md-list-item>
          <md-button class="md-raised md-primary">Add OSM data</md-button>
        </md-list-item>
        <md-list-item>
          <md-button class="md-raised md-primary">Add your own geo-spatial data</md-button>
        </md-list-item>
      </md-list>
    </md-card-content>
  </md-card>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex'

  export default {
    name: 'configure_admin_levels',
    data() {
      return {
        planning_level: '',
        include_areas: {
          adm0: '',
          adm1: '',
          adm2: '',
        }

      }
    },
    methods: {}
  }
</script>

<style scoped>

</style>
