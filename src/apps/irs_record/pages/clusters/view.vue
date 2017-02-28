<template>
  <div style='position: relative'>
    <h1>ClustersView</h1>
    <p>Summary of your locally-saved clusters {{saved_clusters.length}}</p>

    <md-button v-if='need_to_search'>Search for Clusters to save offline</md-button>

    <md-menu id='spray_team_selector' md-direction="top left">
      <md-button md-menu-trigger class='md-raised'>
        Select spray team
      </md-button>

      <md-menu-content>
        <md-menu-item v-for='spray_team in spray_team_options' @selected='select_spray_team(spray_team)'>{{spray_team.name}}</md-menu-item>
      </md-menu-content>
    </md-menu>

    <md-button v-if='spray_team' @click.native='show_all'>Show all</md-button>

    <md-speed-dial style='z-index: 10000' md-open="click" md-direction="bottom" class="md-fab-top-right">
      <md-button class="md-fab" md-fab-trigger>
        <md-icon md-icon-morph>close</md-icon>
        <md-icon>menu</md-icon>
      </md-button>

      <md-button class="md-fab md-primary md-mini md-clean" @click.native='toggle_view'>
        <md-icon>{{toggle_to_view}}</md-icon>
      </md-button>

      <md-button class="md-fab md-primary md-mini md-clean" @click.native='$router.push({name: "irs_record:clusters_search"})'>
        <md-icon>search</md-icon>
      </md-button>

      <md-button class="md-fab md-primary md-mini md-clean" @click.native="navigate('edit')">
        <md-icon>mode_edit</md-icon>
      </md-button>

    </md-speed-dial>

    <router-view :clusters='saved_clusters'></router-view>

  </div>
</template>

<script>
  export default {
    name: 'ClustersView',
    data() {
      return {
        spray_team: {},
        spray_team_options: [
          { id: 'spray_team_1', name: 'Spray team 1'},
          { id: 'spray_team_2', name: 'Spray team 2'},
          { id: 'spray_team_3', name: 'Spray team 3'}
        ],
      }
    },
    computed: {
      saved_clusters() {
        // debugger
        return this.$store.state.irs_tasker.clusters.filter(cluster => {
          return this.$store.state.irs_record.saved_cluster_ids.includes(cluster._id)
        })
      },  
      toggle_to_view() {
        if (this.$route.meta && this.$route.meta.type === 'map') {
          return 'list'
        } else {
          return 'map'
        }
      },
      need_to_search() {
        return this.$store.state.irs_tasker.clusters.length === 0 && !this.spray_team
      }
    },
    methods: {
      navigate(route) {
        this.$router.push({name: `irs_record:clusters:${route}`})
      },
      toggle_view() {
        this.$router.push({name: `irs_record:clusters:${this.toggle_to_view}`})
      },
      show_all() {
        this.select_spray_team({})
      },
      select_spray_team(spray_team) {
        this.spray_team = spray_team
        this.$store.dispatch("irs_record:set_clusters_from_local", spray_team.id)
      } 
    }
  }
</script>