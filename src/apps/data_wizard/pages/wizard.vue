<template>
  <div class="container" >
    <md-stepper md-vertical @change='change' @completed="completed">
      <md-step v-for='{title, description, remote_source} in steps' :key='{title}' :md-label="title">
        <md-radio v-model="test1" md-value="1">Use default sources (MAP, AfriPop, etc)</md-radio>
        <md-radio v-model="test1" md-value="2">Upload your own data</md-radio>
      </md-step>
    </md-stepper>
    <md-button class="md-raised md-warn">Create DiSARM</md-button>
  </div>
</template>

<script>
  import select_country from './select_country.vue'
  import select_spatial_hierarchy from './select_spatial_hierarchy.vue'
  import select_data_source_layers from './select_data_source_layers.vue'
  import create_form from './create_form.vue'
  import create_validations from './create_validations.vue'
  import create_aggregations from './create_aggregations.vue'
  import configure_applets from './configure_applets.vue'
  import configure_map_aggregation from './configure_map_aggregation.vue'
  import configure_table_aggregation from './configure_table_aggregation.vue'

  const steps = [
    select_country,
    select_spatial_hierarchy,
    select_data_source_layers,
    create_form,
    create_validations,
    create_aggregations,
    configure_applets,
    configure_map_aggregation,
    configure_table_aggregation
  ]

  export default {
    components: {select_country, create_form, create_validations, create_aggregations, configure_applets, configure_map_aggregation, configure_table_aggregation, select_spatial_hierarchy, select_data_source_layers},
    name: 'wizard',
    data() {
      return {
        test1: true,
        steps: [
          {
            title: 'Integrate data',
          },
          {
            title: 'Select analyses',
          },
          {
            title: 'Configure applications',
          },
        ]
      }
    },
    methods: {
      next() {
        if (this.step === (this.steps.length -1)) return

        this.step += 1
      },
      back() {
        if (this.step == 0 ) return

        this.step -= 1
      }
    }
  }
</script>

<style scoped>
  .card {
    margin: 1em auto;
  }
</style>
