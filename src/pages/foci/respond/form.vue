<template>
  <div>
    <no-active-foci v-if='!activeFoci' />
    
    <div class="container" v-else>
      <md-card>
        <md-card-header>
          <div class="md-title">Respond</div>
        </md-card-header>
        <md-card-content>
          <div>
            <md-checkbox v-model="responses">Education</md-checkbox>
            <md-checkbox v-model="responses">IRS</md-checkbox>
            <md-checkbox v-model="responses">LLIN distribution</md-checkbox>
            <md-checkbox v-model="responses">Monitoring</md-checkbox>
            <md-input-container>
              <label>Additional information</label>
              <md-textarea></md-textarea>
            </md-input-container>
          </div>
          <md-button class="md-accent md-raised" @click="$router.push({name: 'foci:investigate'})">Save</md-button>
        </md-card-content>
      </md-card>

    </div>
  </div>
</template>

<script>
  import NoActiveFoci from '../../../components/no-active-foci.vue'
  
  export default {
    components: {
      'no-active-foci': NoActiveFoci
    },
    data() {
      return {
        activeFoci: this.$store.state.foci.activeFoci,
      }
    },
    computed: {
      responses: {
        get() {
          return this.activeFoci.properties.responses
        },
        set(newVal) {
          this.$store.commit('setResponses', newVal)
        }
      }
    }
  }

</script>

<style scoped>
  .container {
    max-width: 800px;
    margin: 2em auto;
  }
</style>