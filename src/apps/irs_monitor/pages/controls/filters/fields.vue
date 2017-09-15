<template>
  <div>
    <h2>Filters for all fields</h2>
    <p>Select field and value</p>


    <div class="filter_fields">
      <md-input-container class="filter_field">
        <md-select v-model="filter_name">
          <md-option v-for="field_name in field_names" :key='field_name' :value="field_name">{{field_name}}</md-option>
        </md-select>
      </md-input-container>

      <md-input-container>
        <md-select v-model="filter_comparator">
          <md-option v-for="comparator in comparators" :key="comparator" :value="comparator">{{comparator}}</md-option>
        </md-select>
      </md-input-container>

      <md-input-container>
        <md-select v-model="filter_value" @input="change_handler">
          <md-option v-for="value in field_values" :key="value" :value="value">{{value}}</md-option>
        </md-select>
      </md-input-container>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {get, sort} from 'lodash'
  import flow from 'lodash/fp/flow'
  import flatten from 'lodash/fp/flatten'
  import uniq from 'lodash/fp/uniq'
  import sortBy from 'lodash/fp/sortBy'
  import map from 'lodash/fp/map'

  export default {
    name: 'field-filters',
    props: ['responses', 'field_filter'],
    created() {
      if (this.field_filter) {
        const {
          filter_name,
          filter_comparator,
          filter_value
        } = this.field_filter

        this.filter_name = filter_name
        this.filter_comparator = filter_comparator
        this.filter_value = filter_value
      }
    },
    data() {
      return {
        filter_name: '',
        filter_comparator: 'eq',
        filter_value: '',

        comparators: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte']
      }
    },
    computed: {
      field_names() {
        if (!this.responses || !this.responses.length) return []

        let all_field_names = []
        this.responses.forEach(response => {
          const nested_keys = this.extract_nested_keys(response)
          all_field_names.push(nested_keys)
        })

        const flattened = flow(
          flatten,
          uniq,
          sortBy(x => x)
        )(all_field_names)

        return flattened
      },
      field_values() {
        if (!this.filter_name) return []

        return flow(
          map(r => {
            return get(r, this.filter_name)
          }),
          uniq,
          sortBy(x => x)
        )(this.responses)
      }
    },
    methods: {
      extract_nested_keys(data) {
        var result = {};

        function recurse(cur, prop) {
          if (Object(cur) !== cur) {
            result[prop] = cur;
          } else if (Array.isArray(cur)) {
            for (var i = 0, l = cur.length; i < l; i++)
              recurse(cur[i], prop + '[' + i + ']');
            if (l === 0)
              result[prop] = [];
          } else {
            var isEmpty = true;
            for (var p in cur) {
              isEmpty = false;
              recurse(cur[p], prop ? prop + '.' + p : p);
            }
            if (isEmpty && prop)
              result[prop] = {};
          }
        }

        recurse(data, '');
        return Object.keys(result);
      },
      change_handler() {
        console.log('change_handler')
        const filter = {
          filter_name: this.filter_name,
          filter_comparator: this.filter_comparator,
          filter_value: this.filter_value
        }
        this.$emit('change', filter)
      }
    }
  }
</script>

<style scoped>

  .filter_fields {
    display: flex;
    flex-flow: row wrap;
  }

  .filter_field {
    flex: 1 1 33%;
  }
</style>
