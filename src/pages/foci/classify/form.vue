<template>
  <div>
    <no-active-foci v-if='!activeFoci' />

    <div v-else>
      <input type='radio' name='classification' v-model="classification" value="1" />
      <label>Active</label>
      <input type='radio' name='classification' v-model="classification" value="2" />
      <label>Residual, active</label>
      <input type='radio' name='classification' v-model="classification" value="3" />
      <label>Inactive</label>
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
          if (!this.activeFoci) return ''
          return this.$store.state.activeFoci.classification
        },
        set (newValue) {
          this.$store.state.activeFoci.classification = newValue
        }
      }
    }
  }
</script>

