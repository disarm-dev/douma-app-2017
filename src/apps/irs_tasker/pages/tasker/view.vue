<template>
  <div style='position: relative;'>
    <div class='container'>
      <p>This page allows a manager to assign each Cluster to a spray team.</p>
      <i>This is currently not used in the 'IRS Record' section.</i>
    </div>
    <md-menu id='spray_team_selector' md-direction="bottom right">
      <md-button md-menu-trigger class='md-raised'>
        {{ selector_title }}
      </md-button>

      <md-menu-content>
        <md-menu-item v-for='spray_team in spray_team_options' @selected='select_spray_team(spray_team)'>{{spray_team.name}}</md-menu-item>
      </md-menu-content>
    </md-menu>

    <md-button class="md-primary" @click.native="sync" :disabled='unsynced_clusters.length === 0'>
      <md-icon>cloud_upload</md-icon> Sync
    </md-button>


    <router-view 
      :clusters='clusters' 
      :unsynced_clusters='unsynced_clusters'
      :selected_spray_team='selected_spray_team'>
    </router-view>
  </div>

</template>

<script>
  export default {
    name: 'TaskView',
    props: ['clusters', 'unsynced_clusters'],
    data() {
      return {
        spray_team_options: [
          { id: 'spray_team_1', name: 'Spray team 1'},
          { id: 'spray_team_2', name: 'Spray team 2'},
          { id: 'spray_team_3', name: 'Spray team 3'}
        ],
        selected_spray_team: null

      }
    },
    computed: {
      selector_title() {
        return this.selected_spray_team ? this.selected_spray_team.name : "Select spray team to assign tasks"
      },
    },
    methods: {
      sync() {
        this.$store.dispatch("irs:update_clusters")
      },
      select_spray_team(spray_team){
        this.selected_spray_team = spray_team
      }
    }
  }
</script>

<style>
  
</style>