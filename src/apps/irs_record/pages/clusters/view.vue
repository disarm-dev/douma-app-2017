<template>
  <div>
    <h1>ClustersView</h1>
    <md-button @click.native="$router.push({name: 'irs_record:clusters_search'})">Search</md-button>
    <md-button @click.native="$router.push({name: 'irs_record:clusters:edit'})">Edit</md-button>
    <md-button @click.native="toggle_view">{{toggle_to_view}}</md-button>

    <md-button @click.native="$store.dispatch('irs_record:sync_tasks')" class='md-warn'>SYNC</md-button>
    <md-button @click.native="$store.dispatch('irs_record:clear_local_dbs')" class='md-accent'>CLEAR LOCAL</md-button>
    <md-button @click.native="$store.dispatch('irs_record:seed_local_data_from_files')" class='md-accent'>SEED from FILES</md-button>
    <md-button @click.native="$store.dispatch('irs_record:seed_local_data_from_remote')" class='md-accent'>SEED from REMOTE</md-button>

    <router-view></router-view>

  </div>
</template>

<script>
  export default {
    name: 'ClustersView',
    computed: {
      toggle_to_view() {
        if (this.$route.meta && this.$route.meta.type === 'map') {
          return 'list'
        } else {
          return 'map'
        }
      }
    },
    methods: {
      toggle_view() {
        this.$router.push({name: `irs_record:clusters:${this.toggle_to_view}`})
      }
    }
  }
</script>