<template>
  <md-card>
    <md-card-header>
      <div class="md-title">Review configuration</div>
    </md-card-header>

    <md-card-content>
      <tree-view :data="instance_config" :options="{maxDepth: 4, rootObjectKey: 'instance_config'}"></tree-view>
      <tree-view :data="form" :options="{maxDepth: 4, rootObjectKey:'form'}"></tree-view>
    </md-card-content>
  </md-card>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'complete',
    mounted() {
    },
    computed: {
      ...mapState({
        form: state => state.data_wizard.form,
        instance_config: state => state.data_wizard.instance_config,
      })
    }
  }
</script>

<style scoped>

</style>
