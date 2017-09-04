<template>
  <div>
    <md-card-header>
      <div>2. Select nearest location</div>
    </md-card-header>

    <multiselect
      class="multiselect"
      v-model="category"
      :options="categories"
      placeholder="Select area"
      >
      <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
    </multiselect>

    <multiselect
      class="multiselect"
      v-if="category"
      v-model="selection"
      :options="location_options"
      group-values="locations"
      group-label="category"
      placeholder="Select sub-area"
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
        _fuse: null,
        search_query: '',
        _all_locations: [],

        hidden_category: '',
        _selection: null,


      }
    },
    computed: {
      // primary area selector
      category: {
        get() {
          return this.$store.state.irs_record_point.persisted_metadata.category
        },
        set(category_string) {
          this.$store.commit('irs_record_point/set_persisted_metadata', {name: 'category', value: category_string})
        }
      },
      // secondary area selector
      selection: {
        get() {
          return this._selection
        },
        set(selection_object) {
          this._selection = selection_object
          this.$emit('change', selection_object)
        }
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
    created() {
      this.prepare_fuse()

      if (this.initial_location_selection !== null) {
        this.$emit('change', this.initial_location_selection)
        this.selection = this.initial_location_selection
        this.category = this.find_category_for_selection(this.selection)
      } else {
        this.$emit('change', this.selection)
      }
    },
    methods: {
      prepare_fuse() {
        this._all_locations = get_record_location_selection()

        const fuse_options = {
          keys: ['name']
        }

        this._fuse =  new Fuse(this._all_locations, fuse_options)
      },
      find_category_for_selection(selection) {
        const found = this._all_locations.find(l => l.id === selection.id)
        if (found) return found.category
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
