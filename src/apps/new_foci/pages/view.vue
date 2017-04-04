<template>
  <div>
    <h1>FociView</h1>
  </div>
</template>

<script>

  export default {
    name: 'FociView',
    watch: {
    },
    created() {
    },
    data () {
      return {
        
      }
    },
    computed: {
      country() {
        return this.$store.state.meta.country
      },
    },
    methods: {

    }

  }
</script>