<template>
  <div>
    <no-active-foci v-if='!activeFoci' />

    <div v-else>
      <input type='radio' name='classification' v-model="classification" value="active" />
      <label>Active</label>
      <input type='radio' name='classification' v-model="classification" value="residual_active" />
      <label>Residual, active</label>
      <input type='radio' name='classification' v-model="classification" value="inactive" />
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

