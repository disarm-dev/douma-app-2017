<template>
  <md-card class="card">
    <md-card-header>
      <div class="md-title">Configure applets</div>
    </md-card-header>
    <md-card-content>
      <md-list>
        <md-list-item v-for="applet in applets" :key="applets.name">
          <md-icon>{{applet.icon}}</md-icon>
          <span>{{applet.title}}</span>
          <md-checkbox v-model="enabled_applets[applet.name]"></md-checkbox>
        </md-list-item>
      </md-list>
    </md-card-content>
    <md-card-actions>
      <md-button @click.native="save_and_continue">Save</md-button>
    </md-card-actions>
  </md-card>
</template>

<script>
import common_config from 'config/common'


export default {
  name: 'configure_applets',
  data () {
    return {
      applets: [],

      enabled_applets: {},
    }
  },
  mounted() {
    let formatted_applets = []
    let applets_copy = Object.assign({}, common_config.applets)

    delete applets_copy.meta
    delete applets_copy.data_wizard

    for (let applet_name in applets_copy) {
      let result = applets_copy[applet_name]
      result.name = applet_name
      formatted_applets.push(result)
    }

    this.applets = formatted_applets
  },
  methods: {
    save_and_continue() {
      const applets = {}

      for (let i in this.enabled_applets) {
        if (this.enabled_applets[i]) applets[i] = {}
      }

      this.$store.commit('data_wizard/set_applets', applets)

    }
  }
};
</script>

<style lang="css" scoped>
.card {
  margin: 1em auto;
}
</style>
