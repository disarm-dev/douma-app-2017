<template>
  <div>
    <bread-crumbs :crumbs="crumbs"></bread-crumbs>

    <h2>Map individual cluster</h2>
    <p>Cluster id: {{$route.params.cluster_id}}</p>

    <md-button @click="$router.push({name: 'irs_progress:cluster:view'})">View</md-button>
    <md-button @click="$router.push({name: 'irs_progress:cluster:map'})">Map</md-button>
  </div>
</template>

<script>
  import BreadCrumbs from '../../../components/breadCrumbs.vue'
  export default {
    components: {
      BreadCrumbs
    },
    data() {
      return {
        crumbs: []
      }
    },
    mounted() {
      this.crumbs = [
        {
          title: 'Clusters >',
          route: {name: 'irs_progress:clusters:list'}
        },
        {
          title: `${this.$route.params.cluster_id} Map`,
          route: {name: 'irs_progress:clusters:list'}
        }
      ]
    }
  }
</script>