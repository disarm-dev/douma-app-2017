<template>
  <div>
    <no-active-foci v-if='!activeFoci' />

    <div class="container" v-else>
      <md-card>
        <md-card-header>
          <div class="md-title">Classify</div>
        </md-card-header>
        <md-card-content>
          <div>
            <md-radio v-model="classification" md-value="active">Active</md-radio>
            <md-radio v-model="classification" md-value="residual">Residual, active</md-radio>
            <md-radio v-model="classification" md-value="inactive">Inactive</md-radio>
          </div>
          <md-button class="md-accent md-raised">Save</md-button>
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
        activeFoci: this.$store.state.activeFoci,
      }
    },
    computed: {
      classification: {
        get () {
          return this.$store.state.activeFoci.properties.classification
        },
        set (newValue) {
          this.$store.commit('setClassification', newValue)
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

  .radio {

  }
</style>

