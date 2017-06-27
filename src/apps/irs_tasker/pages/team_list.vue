<template>
  <div style="margin-top:1em;">
    <md-card>
      <md-list>
        
        <md-list-item>
          <p class="md-title">Teams for {{country}}</p>
        </md-list-item>


        <md-list-item v-if="!decorated_teams.length">
          There are currently no teams. Add one below.
        </md-list-item>
        
        <md-list-item v-for="(team, index) in decorated_teams" :key="index">
          
          <md-avatar :style="{'background-color': team.colour}" class="md-avatar-icon">
            <md-icon>people</md-icon>
          </md-avatar>
          
          <div class="md-list-text-container">
            <span>{{team.team_name}}</span>
            <span>Assigned {{team.count}} areas</span>
          </div>

          <!-- <md-button @click.native="edit_team(team.id)">
            Edit 
          </md-button> -->

        </md-list-item>

        <md-list-item v-if="show_input">
          <md-input-container>
            <label>Team name</label>
            <md-input v-model="name"></md-input>
          </md-input-container>
          <md-button @click.native="save_teams">
            Save
          </md-button>
        </md-list-item>
          
        <md-divider></md-divider>

        <md-list-item>
          <md-button class="md-raised md-primary" @click.native="show_add_team_input">Add team</md-button>
        </md-list-item>

      </md-list>
    </md-card>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    props: ['decorated_teams'],
    data() {
      return {
        name: '',
        show_input: false
      }
    },
    computed: {
      ...mapState({
        'country': state => state.instance_config.name,
        'team_names': state => state.irs_tasker.teams,
      })
    },
    methods: {
      show_add_team_input() {
        this.show_input = true
      },
      save_teams() {

        if (this.decorated_teams.length == 12) {
          return console.log('Max 12 teams')
        }
        
        // Check name is unique
        for (var i = this.decorated_teams.length - 1; i >= 0; i--) {
          if (this.decorated_teams[i].team_name === this.name) {
            return console.log('Name must be unique')
          }
        }

        this.$store.dispatch('irs_tasker/update_teams', this.team_names.concat(this.name))
        this.show_input = false
        this.name = ""
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
