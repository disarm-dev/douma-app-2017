<template>
  <div>
    <h1>RECORD {{country}}</h1>
    <h3>Type: {{type}}</h3>
    <location_record v-on:change='update_location'></location_record>
  </div>
</template>

<script>
  import location_record from '@/components/location.vue'

  export default {

    name: 'home',
    components: {location_record},
    data () {
      return {
      }
    },
    computed: {
      country() {
        return this.$store.state.instance_config.name
      },
      type() {
        return this.$store.state.instance_config.applets.irs_record_point.location_type
      }
    },
    methods: {
      update_location(location) {
        console.log(location)
      }
    }
  }
</script>

<style lang="css" scoped>
</style>