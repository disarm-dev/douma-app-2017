<template>
  <div>
    <no-active-foci v-if='!$store.state.foci.activeFoci' />

    <div class="container" v-else>
      <md-card>
        <md-card-header>
          <div class="md-title">Classify</div>
        </md-card-header>
        <md-card-content>
          <div>
            <md-radio v-model="activeFoci.properties.classification" md-value="active">Active</md-radio>
            <md-radio v-model="activeFoci.properties.classification" md-value="residual">Residual, active</md-radio>
            <md-radio v-model="activeFoci.properties.classification" md-value="inactive">Inactive</md-radio>
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
        this.$store.commit('foci:setClassification', this.activeFoci.properties.classification)
        this.$router.push({name: 'foci:investigate'})
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

