<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'ClusterView',
    props: ['cluster_id']
  }
</script>
