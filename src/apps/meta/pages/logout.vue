<template>
  <div class='logout'>

  </div>
</template>

<script>

  export default {
    mounted() {
      this.$store.dispatch('meta/logout').then(() => {
        // TODO @feature Use Vuex to clear out localStorage instead of forcing it like this
        localStorage.clear()
        this.$router.push('/meta/login')
      })
    }
  }
</script>

<style>
  
</style>
