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
      label="name"
      :internal-search="false"
      @search-change="search"
      >
      <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
    </multiselect>
  </div>
</template>

<script>
  import Fuse from 'fuse.js'
  import array_unique from 'array-unique'
  import Multiselect from 'vue-multiselect'
  import {get_record_location_selection} from 'lib/geodata/spatial_hierarchy_helper'

  export default {
    name: 'location_selection',
    props: ['initial_location_selection'],
    components: {Multiselect},
    data() {
      return {
        location_selection: null,
        _fuse: null,
        search_query: '',
        _all_locations: []
      }
    },
    created() {
      this.prepare_fuse()
      if (this.initial_location_selection !== null) {
        this.location_selection = this.initial_location_selection
        this.$emit('change', this.location_selection)
      }
    },
    computed: {
      location_options() {
        let result
        if (this.search_query.length) {
          result = this._fuse.search(this.search_query)
        } else {
          result = this._all_locations
        }

        // present locations for multiselect

        const categories = array_unique(result.map(r => r.category)).sort()

        const nested = categories.map(category => {
          const matches = result
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
      },
    },
    methods: {
      prepare_fuse() {
        this._all_locations = get_record_location_selection()

        const fuse_options = {
          keys: ['name']
        }

        this._fuse =  new Fuse(this._all_locations, fuse_options)
      },
      select_location(location_selection) {
        this.location_selection = location_selection
        this.$emit('change', this.location_selection)
      },
      search(query) {
        this.search_query = query
      }
    }
  }
</script>
