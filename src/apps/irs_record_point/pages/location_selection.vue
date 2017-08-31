<template>
  <div>
    <md-card-header>
      <div>2. Select nearest location</div>
    </md-card-header>

    <multiselect
      class="multiselect"
      v-model="category"
      @select="select_category"
      :options="categories"
      >
      <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
    </multiselect>

    <multiselect
      class="multiselect"
      v-if="category"
      v-model="selection"
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
  import Multiselect from 'vue-multiselect'
  import {get_record_location_selection} from 'lib/geodata/spatial_hierarchy_helper'
  import { uniq } from 'lodash'

  export default {
    name: 'location_selection',
    props: ['initial_location_selection'],
    components: {Multiselect},
    data() {
      return {
        category: null,
        selection: null,
        _fuse: null,
        search_query: '',
        _all_locations: []
      }
    },
    created() {
      this.prepare_fuse()
      if (this.initial_location_selection !== null) {
        this.selection = this.initial_location_selection
        this.$emit('change', this.selection)
      }

      if (this.initial_category !== null) {
        this.category = this.initial_category
      }
    },
    computed: {
      initial_category() {
        return this.$store.state.irs_record_point.category
      },
      categories() {
        const all_categories = this._all_locations.map(loc => {
          return loc.category
        })

        return uniq(all_categories).sort()
      },
      location_options() {
        let result
        if (this.search_query.length) {
          result = this._fuse.search(this.search_query)
        } else {
          result = this._all_locations
        }

        // present locations for multiselect

        const categories = uniq(result.map(r => r.category)).filter(c => c === this.category).sort()

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
      select_category(category) {
        this.category = category
        this.$store.commit('irs_record_point/set_category', category)
      },
      select_location(selection) {
        this.selection = selection
        this.$emit('change', this.selection)
      },
      search(query) {
        this.search_query = query
      }
    }
  }
</script>
<style>
  .multiselect {
    margin-top: 0.5em;
  }
</style>
