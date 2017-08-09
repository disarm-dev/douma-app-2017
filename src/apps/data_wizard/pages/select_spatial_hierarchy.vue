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
        
        <md-list-item v-for="level in levels" :key="level">
          <span>{{level}}</span>
          <md-checkbox v-model="include_areas[level]"></md-checkbox>

          <md-radio v-model="planning_level" :md-value="level"></md-radio>
        </md-list-item>

        <!-- <md-list-item>
          <span>Admin 1</span>
          <md-checkbox v-model="include_areas.adm0"></md-checkbox>

          <md-radio v-model="planning_level" md-value="one"></md-radio>
        </md-list-item>

        <md-list-item>
          <span>Admin 2</span>
          <md-checkbox v-model="include_areas.adm1"></md-checkbox>

          <md-radio v-model="planning_level" md-value="two"></md-radio>
        </md-list-item>

        <md-list-item>
          <span>Admin 3</span>
          <md-checkbox v-model="include_areas.adm2"></md-checkbox>

          <md-radio v-model="planning_level" md-value="three"></md-radio>
        </md-list-item> -->

        <md-list-item>
          <md-button class="md-raised md-primary">Add OSM data</md-button>
        </md-list-item>
        <md-list-item>
          <md-button class="md-raised md-primary">Add your own geo-spatial data</md-button>
        </md-list-item>
      </md-list>
    </md-card-content>
    <md-card-actions>
        <md-button @click.native="select_spatial_hierarchy">Select spatial hierarchy</md-button>
      </md-card-actions>
  </md-card>
</template>

<script>
export default {
  name: 'select_spatial_hierarchy',

  data () {
    return {
      planning_level: '',
      include_areas: {
        adm0: '',
        adm1: '',
        adm2: '',
      },
      // TODO: @feature Replace with response from remote
      levels: ['1', '2', '3']
    };
  },
  methods: {
    select_spatial_hierarchy() {
      console.log('this.include_areas', this.include_areas)
      console.log('this.planning_level', this.planning_level)

      let final_areas = []
      for (let level_name in this.include_areas) {
        if (this.include_areas[level_name]) {
          final_areas.push(level_name)
        }
      }

      this.$store.commit('data_wizard/set_spatial_hierarchies', final_areas)
      this.$store.commit('data_wizard/set_planning_level', this.planning_level)

      // TODO: @feature Send planning level
    }
  }
};
</script>

<style lang="css" scoped>
</style>