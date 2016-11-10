<template>
  <div>
    <no-active-foci v-if='!activeFoci' />
    
    <div v-else>
      <input type="checkbox" value="Education" v-model="responses">
      <label for="jack">Education</label>
      <input type="checkbox" value="IRS" v-model="responses">
      <label for="john">IRS</label>
      <input type="checkbox" value="LLIN distribution" v-model="responses">
      <label for="mike">LLIN distribution</label>
      <input type="checkbox" value="Monitoring" v-model="responses">
      <label for="mike">Monitoring</label>

      <md-input-container>
        <label>Free text</label>
        <md-textarea></md-textarea>
      </md-input-container>

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
      responses () {
        if (!this.activeFoci) return ''
        return this.$store.state.activeFoci.responses
      }
    }
  }

</script>