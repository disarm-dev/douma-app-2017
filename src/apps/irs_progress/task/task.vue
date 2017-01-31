<template>
  <div>
    <div>Task view - form</div>
    <md-button @click='cancel'>Cancel</md-button>
  </div>
</template>

<script>
  export default {
    methods: {
      cancel() {
        this.$router.back()
      }
    }
  }
</script>