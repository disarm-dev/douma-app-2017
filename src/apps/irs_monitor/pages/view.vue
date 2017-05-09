<template>
  <h1>DASHBOARD: {{country}}</h1>
</template>

<script>
export default {

  name: 'view',

  data () {
    return {

    };
  },
  computed: {
    country() {
      return this.$store.state.instance_config.name
    }
  }
};
</script>

<style lang="css" scoped>
</style>