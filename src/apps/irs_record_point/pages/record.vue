<template>
  <div class='container'>
    <h1>RECORD {{country}}</h1>
    <location_record v-on:change='update_location'></location_record>
  </div>
</template>

<script>
  import location_record from '@/components/location.vue'

  export default {

    name: 'record',
    components: {location_record},
    data () {
      return {
      }
    },
    computed: {
      country() {
        return this.$store.state.instance_config.name
      },
    },
    methods: {
      update_location(location) {
        console.log(location)
      }
    }
  }
</script>

<style lang="css" scoped>
  .container {
    margin: 10px;
  }
</style>
