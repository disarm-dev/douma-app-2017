<template>
  <md-card>
    <md-card-header>
      <div class="md-title">Review configuration</div>
    </md-card-header>

    <md-card-content>
      <tree-view v-for='piece in instance_pieces' :key='piece' :data="$store.state.data_wizard[piece]" :options="{maxDepth: 0, rootObjectKey: piece}"></tree-view>
    </md-card-content>
  </md-card>
</template>

<script>
  export default {
    name: 'complete',
    data() {
      return {
        instance_pieces: ['instance_config', 'form', 'validations', 'aggregations', 'presenters']
      }
    },
    mounted() {
    },
  }
</script>

<style scoped>

</style>
