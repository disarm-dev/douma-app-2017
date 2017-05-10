<template>
  <div>
    <h1>RECORD {{country}}</h1>
    <h3>Type: {{type}}</h3>
  </div>
</template>

<script>
export default {

  name: 'home',

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
  }
};
</script>

<style lang="css" scoped>
</style>