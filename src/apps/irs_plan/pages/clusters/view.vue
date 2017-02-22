<template>
  <div>
    <h1>ClustersView</h1>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'ClustersView',
    mounted() {
      this.$store.dispatch("irs_plan:load_clusters").then(res => {
        if(!res) this.$router.push({name:'irs_plan:operational_unit'})
      })
    }
  }
</script>