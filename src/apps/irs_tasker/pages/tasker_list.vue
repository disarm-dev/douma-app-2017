<template>
  <div class="container"> 
    <md-card>
      <md-list>
        
        <md-list-item>
          <p class="md-title">Teams for {{country}}</p>
        </md-list-item>


        <md-list-item v-if="!teams.length">
          There are currently no teams. Add one below.
        </md-list-item>
        
        <md-list-item v-for="team in teams" :key="team.id">
          
          <md-avatar :style="{'background-color': team.colour}" class="md-avatar-icon">
            <md-icon>people</md-icon>
          </md-avatar>
          
          <div class="md-list-text-container">
            <span>{{team.name}}</span>
            <span>Assigned XX areas</span>
          </div>

          <md-button @click.native="edit_team(team.id)">
            Edit 
          </md-button>

        </md-list-item>
          
        <md-divider></md-divider>

        <md-list-item>
          <md-button class="md-raised" @click.native="assign_teams">Assign Teams</md-button>
          <md-button class="md-raised md-primary" @click.native="add_team">Add team</md-button>
        </md-list-item>

      </md-list>
    </md-card>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    computed: {
      ...mapState({
        'country': state => state.instance_config.name,
        'teams': state => state.irs_tasker.teams
      })
    },
    methods: {
      add_team() {
        this.$router.push({name: 'irs_tasker:add_team'})
      },
      edit_team(team_id) {
        this.$router.push({name: 'irs_tasker:add_team', params: {team_id}})
      },
      remove_team(team) {
        this.$store.dispatch('irs_tasker/remove_team', {team})
      },
      assign_teams() {
        this.$router.push({name: 'irs_tasker:assign_teams'})
      }
    }
  }
</script>

<style scoped>
  .list {
    max-width: 700px;
    margin: 0 auto;
  }
</style>
