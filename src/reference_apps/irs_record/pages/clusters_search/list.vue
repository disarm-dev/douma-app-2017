<template>
  <div>
    <h1>ClustersSearchList</h1>
    <!-- TODO: @feature use virtual scroll list instead -->
    <md-list>
      <md-list-item 
        v-for='cluster in search_results'
        :key='cluster._id'
        @click.native='add_or_remove_from_keep(cluster)'
        class='result'
        :class='{green: cluster.included}'>
        <md-icon>{{ cluster.included? 'check_box' : 'check_box_outline_blank'}}</md-icon>
        <span>{{cluster._id}}</span>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
  export default {
    name: 'ClustersSearchList',
    props: ['clusters'],
    computed: {
      search_results() {
        return this.clusters.map((r) => {
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