<template>
</template>

<script>
export default {

  name: 'home',

  data () {
    return {

    };
  },
  computed: {
    applets() {
      return this.$store.state.meta.user.allowed_apps.write
    }
  }
};
</script>

<style lang="css" scoped>
</style>