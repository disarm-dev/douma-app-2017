<template>
  <div>
    <h1>ClustersSearchList</h1>
    <md-list>
      <md-list-item v-for='cluster in search_results'>{{cluster.name}}</md-list-item>
    </md-list>
  </div>
</template>

<script>
  export default {
    name: 'ClustersSearchList',
    props: ['search_results']
  }
</script>