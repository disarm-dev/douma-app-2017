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
            <md-input v-model="new_name"></md-input>
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
        new_name: '',
        show_input: false
      }
    },
    computed: {
      ...mapState({
        country: state => state.instance_config.name,
        team_names: state => state.irs_tasker.teams,
      })
    },
    methods: {
      show_add_team_input() {
        if (this.decorated_teams.length == 12) {
          this.show_input = false
          this.$store.commit('root:set_snackbar', {message: 'Maximum 12 teams.'})
        }
        this.show_input = true
      },
      save_teams() {
        // Names must be unique
        if (this.team_names.includes(this.new_name)) {
          return this.$store.commit('root:set_snackbar', {message: 'Names must be unique.'})
        }

        // Name cannot be "Unassigned". We use that.
        if (this.new_name.toLowerCase() === 'unassigned') {
          return this.$store.commit('root:set_snackbar', {message: 'Cannot use "Unassigned" as team name!'})
        }

        this.$store.dispatch('irs_tasker/update_teams', this.team_names.concat(this.new_name))
        this.show_input = false
        this.new_name = ""
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
