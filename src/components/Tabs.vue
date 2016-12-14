<template>
  <md-tabs @change="onTabChange" :md-centered="true">
    <md-tab v-for="(route, index) in routes" :md-label="route.title" :md-active="active == index"></md-tab>
  </md-tabs>  
</template>

<script> 
  export default {
    props: ['routes'],
    data() {
      return {
        active: this.routes.findIndex(r => this.$route.name.indexOf(r.name) >= 0)
      }
    },
    methods: {
      onTabChange(i) {
        this.active = i
        this.$router.push({name: this.routes[i].name})
      }
    }
  }
</script>

<style>
  .md-tabs .md-tabs-content {
    height: 0 !important;
  }

  @media screen and (max-width: 500px) {
    .md-tabs-navigation {
      overflow-x: scroll;
      justify-content: flex-start !important;
    }
    .md-tab-header {
      min-width: auto !important;
      max-width: none !important;
    }
  }
</style>