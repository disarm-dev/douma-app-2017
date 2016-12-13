<template>
  <div>
    <h1 class="md-title" style="text-align:center;">{{msg}}</h1>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        msg: 'Logging out...'
      }
    },
    mounted() {
      setTimeout(() => {
        this.$router.push({name: 'root'})
      }, 3000)
    }
  }
</script>