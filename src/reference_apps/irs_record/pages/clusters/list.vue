  <template>
  <div>
    <h1>ClustersList</h1>
    <md-list v-if='clusters_with_sync_counts' class="md-double-line">
      <md-list-item v-for="cluster in clusters_with_sync_counts" :key='cluster._id' @click.native="$router.push({name: 'irs_record:cluster', params: {cluster_id: cluster._id}})">
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

        <md-button v-else @click.native.stop='close(cluster)' >
          <md-icon class='md-warn'>close</md-icon> 
          Close
        </md-button>
      </md-list-item>
    </md-list>
    <div v-else>Wait for it...</div>
  </div>
</template>

<script>
  export default {
    name: 'ClustersList',
    props: ['clusters'],
    mounted(){
      this.set_clusters_with_sync_counts()
    },
    watch: {
      'clusters': 'set_clusters_with_sync_counts',
    },
    data() {
      return {
        clusters_with_sync_counts: []
      }
    },
    methods: {
      set_clusters_with_sync_counts() {
        this.$store.dispatch("irs_record:get_unsynced_tasks_for_cluster", this.clusters).then(res => {
          this.clusters_with_sync_counts = res
        })
      },
      sync(cluster) {
        this.$store.dispatch('irs_record:sync_tasks', cluster.unsynced_tasks)
          .then(() => {
            this.set_clusters_with_sync_counts()
          })
      },
      close(cluster) {
        this.$store.dispatch('irs_record:close_cluster', cluster).then(() => {
          this.set_clusters_with_sync_counts()
        })
      }
    }
  }
</script>