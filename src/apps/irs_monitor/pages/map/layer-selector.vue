<template>
  <div>

    <multiselect
        :options="layer_options"
        track-by="id"
        label="label"
        @input="set_selected_layer"
        :value="selected_layer_id"
    >
    </multiselect>

  </div>
</template>

<script>
  //import { mapState, mapActions, mapMutations } from 'vuex'
  import Multiselect from 'vue-multiselect'

  export default {
    name: 'layer-selector',
    components: {Multiselect},
    props: ['aggregation_names', 'selected_layer'],
    data() {
      return {}
    },
    computed: {
      layer_options() {
        const fixed_options = [
          { id: 'none', label: 'No layer' },
          { id: 'normalised_risk', label: 'Risk' }
        ]

        return fixed_options.concat(this.aggregation_names.map(name => {
          return {id: name, label: name}
        }))

      },
      selected_layer_id() {
        return this.layer_options.find(o => o.id === this.selected_layer)
      }
    },
    methods: {
      set_selected_layer(option) {
        this.$emit('change', option.id)
      }
    }
  }
</script>

<style scoped>

</style>