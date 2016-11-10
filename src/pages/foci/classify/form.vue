<template>
  <div>
    <md-radio v-model="classification" md-value="1">Active</md-radio>
    <md-radio v-model="classification" md-value="2">Residual, active</md-radio>
    <md-radio v-model="classification" md-value="3">Inactive</md-radio>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        classification: '0'
      }
    }
  }
</script>