<template>
  <div>
    <md-card-header>
      <div>2. Select nearest location</div>
    </md-card-header>

    <multiselect
      v-model="location_selection"
      @select="select_location"
      :options="location_options"
      group-values="locations"
      group-label="category"
      placeholder="Alternative location search"
      track-by="id"
      label="name">
      <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
    </multiselect>
  </div>
</template>

<script>
  import array_unique from 'array-unique'
  import Multiselect from 'vue-multiselect'
  import 'vue-multiselect/dist/vue-multiselect.min.css'

  export default {
    props: ['initial_location_selection'],
    components: {Multiselect},
    data() {
      return {
        location_selection: null
      }
    },
    mounted() {
      if (this.initial_location_selection) {
        this.location_selection = this.initial_location_selection
        this.$emit('change', this.location_selection)
      }
    },
    computed: {
      location_options() {
        const raw = this.$store.state.instance_config.location

        const categories = array_unique(raw.map(r => r.category)).sort()

        const nested = categories.map(category => {
          const matches = raw
            .filter(r => r.category === category)
            .map(r => {
              return {
                name: r.name,
                id: r.id
              }
            })
          return {
            category,
            locations: matches
          }
        })

        return nested
      }
    },
    methods: {
      select_location(location_selection) {
        this.location_selection = location_selection
        this.$emit('change', this.location_selection)
      }
    }
  }
</script>