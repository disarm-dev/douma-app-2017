<template>
  <div class="container">
    <div>
      <md-button @click.native="go_back">Back</md-button>
    </div>
    
    <md-card class="add_team_card">
      <md-card-header>
        <div class="md-title">{{ team_id ? 'Update' : 'Add'}} team</div>    
      </md-card-header>
      <md-card-content>
        <md-input-container>
          <label>Team name</label>
          <md-input v-model="name"></md-input>
        </md-input-container>

        <md-input-container>
          <label>colour (HEX)</label>
          <md-input v-model="colour"></md-input>
        </md-input-container>
      </md-card-content>
      <md-card-actions>
        
        <md-button v-if="team_id" class="md-raised md-primary" @click.native="update_team">
          Update Team
        </md-button>

        <md-button v-else class="md-raised md-primary" @click.native="add_team">
          Add Team
        </md-button>

        <md-button v-if="team_id" class="md-raised md-warn" @click.native="remove_team">
          Remove Team
        </md-button>

      </md-card-actions>
    </md-card>
  </div>
</template>
<script>
  import uuid from 'uuid/v4'
  import {mapState} from 'vuex'

  export default {
    props: ['team_id'],
    data() {
      return {
        name: '',
        colour: ''
      }
    },
    computed: {
      ...mapState({
        teams: state => state.irs_tasker.teams
      })
    },
    mounted() {
      if (this.team_id) {
        const team = this.teams.find((t) => t.id === this.team_id)
        this.name = team.name
        this.colour = team.colour
      }
    },
    methods: {
      go_back() {
        this.$router.push({name: 'irs_tasker'})
      },
      add_team() {
        const team = {
          id: uuid(),
          name: this.name,
          colour: this.colour
        }

        this.$store.dispatch('irs_tasker/add_team', {team})
        this.go_back()
      },
      update_team() {
        const team = {
          id: this.team_id,
          name: this.name, 
          colour: this.colour
        }
        this.$store.dispatch('irs_tasker/update_team', {team})
        this.go_back()
      },
      remove_team() {
        let team = {
          id: this.team_id
        }

        this.$store.dispatch('irs_tasker/remove_team', {team})
        this.go_back()
      }
    }
  }
</script>
<style scoped>
  .add_team_card {
    max-width: 800px;
    margin: 0 auto;
  }
</style>