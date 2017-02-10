<template>
  <div style='position: relative'>
    <md-speed-dial style='z-index: 10000' md-open="click" md-direction="bottom" class="md-fab-top-right" md-theme="light-blue">
      <md-button class="md-fab" md-fab-trigger>
        <md-icon md-icon-morph>event</md-icon>
        <md-icon>add</md-icon>
      </md-button>

      <md-button class="md-fab md-primary md-mini md-clean" @click.native='toggle_view'>
        <md-icon>{{toggle_to_view}}</md-icon>
      </md-button>

      <md-button class="md-fab md-primary md-mini md-clean" @click.native='$router.push({name: "irs_record:clusters_search"})'>
        <md-icon>search</md-icon>
      </md-button>
    </md-speed-dial>

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