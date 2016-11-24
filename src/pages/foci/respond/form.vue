<template>
  <div>
    <no-active-foci v-if='!activeFoci.properties' />
    
    <div class="container" v-else>
      <md-card>
        <md-card-header>
          <div class="md-title">Respond</div>
        </md-card-header>
        <md-card-content>
          <div>
            
            <md-checkbox v-for="response in activeFoci.properties.responses" v-model="response.value">{{response.name}}</md-checkbox>
            
            <md-input-container>
              <label>Additional information</label>
              <md-textarea></md-textarea>
            </md-input-container>
          </div>
          <md-button class="md-accent md-raised" @click="save">Save</md-button>
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
        activeFoci: Object.assign({}, this.$store.state.foci.activeFoci),
      }
    },
    methods: {
      save() {
        this.$store.commit('foci:setResponses', this.activeFoci.properties.responses)
        this.$router.push({name: 'foci:investigate'})
      }
    }
    // computed: {
    //   responses: {
    //     get() {
    //       return this.activeFoci.properties.responses
    //     },
    //     set(newVal) {
    //       this.$store.commit('setResponses', newVal)
    //     }
    //   }
    // }
  }

</script>

<style scoped>
  .container {
    max-width: 800px;
    margin: 2em auto;
  }
</style>