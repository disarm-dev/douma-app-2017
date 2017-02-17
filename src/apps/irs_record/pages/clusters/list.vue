  <template>
  <div>
    <h1>ClustersList</h1>
    <md-list v-if='clusters_with_sync_counts' class="md-double-line">
      <md-list-item v-for="cluster in clusters_with_sync_counts" @click.native="$router.push({name: 'irs_record:cluster', params: {cluster_id: cluster._id}})">
        <div class="md-list-text-container">
          <span>
            {{cluster.name}} - {{cluster._id}} 
            <template v-if='cluster.unsynced_tasks.length > 0'>
              [{{cluster.unsynced_tasks.length}} unsynced]
            </template>
          </span>
        </div>
        <md-button v-if='cluster.unsynced_tasks.length > 0' @click.native.stop='sync(cluster)' >
          <md-icon class='md-warn'>cloud_upload</md-icon> 
          Sync
        </md-button>
      </md-list-item>
    </md-list>
    <div v-else>Wait for it...</div>
  </div>
</template>

<script>
  export default {
    name: 'ClustersList',
    mounted(){
      this.set_clusters_with_sync_counts()
    },
    data() {
      return {
        clusters_with_sync_counts: []
      }
    },
    methods: {
      set_clusters_with_sync_counts() {
        console.log('set clusters')
        // TODO: @refac Move unsynced_tasks count to $store
        this.clusters_with_sync_counts = []

        const all_clusters = this.$store.state.irs_record.clusters
        const promises = all_clusters.map((cluster) => {
          return Sync.get_unsynced_tasks_for_cluster(cluster)
        })

        Promise.all(promises).then((results) => {
          console.table(results)
          results.forEach((result) => {
            let cluster = all_clusters.find(c => c._id === result.cluster_id)
            cluster.unsynced_tasks = result.unsynced_tasks
            this.clusters_with_sync_counts.push(cluster)
          })
        })
      },
      sync(cluster) {
        this.$store.dispatch('irs_record:sync_tasks', cluster.unsynced_tasks)
          .then(() => {
            this.set_clusters_with_sync_counts()
          })
      }
    }
  }
</script>