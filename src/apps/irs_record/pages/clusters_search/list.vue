<template>
  <div>
    <h1>ClustersSearchList</h1>
    <md-list>
      <md-list-item 
        v-for='cluster in search_results'
        @click.native='add_or_remove_from_keep(cluster)'
        class='result'
        :class='{green: cluster.included}'>
        <md-icon>{{ cluster.included? 'check_box' : 'check_box_outline_blank'}}</md-icon>
        <span>{{cluster.name}}</span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
  export default {
    name: 'ClustersSearchList',
    computed: {
      search_results() {
        return this.$parent.search_results.map((r) => {
          r.included = this.$parent.clusters_to_open.includes(r)
          return r
        })
      }
    },
    methods: {
      add_or_remove_from_keep(cluster) {
        let clusters_to_open = this.$parent.clusters_to_open
        if (clusters_to_open.includes(cluster)) {
          const index = clusters_to_open.findIndex(c => c._id === cluster._id)
          clusters_to_open.splice(index, 1)
        } else {
          clusters_to_open.push(cluster)
        }
        console.log('Do something with', clusters_to_open)
      }
    }
  }
</script>

<style scoped>
  .result {
    color: grey;
  }

  .green {
    color: green;
  }

</style>