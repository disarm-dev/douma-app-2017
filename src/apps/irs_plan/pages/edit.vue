<template>
  <div class='container'>
    <h1>IRS Plan</h1>
    <div v-if="online">
      <md-checkbox v-model="edit_mode" :disabled="edit_disabled">Edit mode</md-checkbox>

      <!--VIEW ONLY-->
      <md-button v-if='!edit_mode' class='md-raised' @click.native="load_plan">Load</md-button>

      <!--EDIT MODE-->
      <md-button v-if='edit_mode' :disabled="!unsaved_changes" class='md-raised md-primary' @click.native="save_plan">Save</md-button>
      <md-button v-if='edit_mode' :disabled="!unsaved_changes" class='md-raised md-warn' @click.native="load_plan">Cancel edits</md-button>
      <md-button v-if='edit_mode' :disabled='!can_clear' class='md-raised' @click.native="clear_plan">Clear plan</md-button>

      <plan_map :data_ready="data_ready" :edit_mode="edit_mode" v-on:map_loaded="edit_disabled = false"></plan_map>

      <md-card class="card"><md-card-content>
        <plan_summary :data_ready="data_ready"></plan_summary>
      </md-card-content></md-card>
    </div>
    <div v-else>
      <h3>Plan only available with a network connection.</h3>
    </div>

  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'

  import plan_summary from './plan-summary.vue'
  import plan_map from './plan-map.vue'
  import cache from '@/lib/cache.js'


  export default {
    name: 'edit',
    components: {plan_summary, plan_map},
    data() {
      return {
        data_ready: false,
        edit_mode: false,
        edit_disabled: true
      }
    },
    computed: {
      ...mapState({
        denominator_def: state => state.instance_config.spatial_hierarchy[0],
        slug: state => state.instance_config.slug,
        unsaved_changes: state => state.irs_plan.unsaved_changes,
        online: state => state.network_online
      }),
      ...mapGetters({
        selected_target_area_ids: 'irs_plan/all_selected_area_ids'
      }),
      can_clear() {
        return this.selected_target_area_ids.length !== 0
      }
    },
    mounted() {
      this.$store.commit('root:set_loading', true)
      this.$store.dispatch('irs_plan/get_geodata', {slug: this.slug, level: this.denominator_def.name, cache})
        .then(() => {
          this.$store.commit('root:set_loading', false)
          this.data_ready = true
        })
        .catch(() => {
          this.$store.commit('root:set_loading', false)
        })
    },
    methods: {
      load_plan() {
        this.$store.commit('root:set_loading', true)

        this.$store.dispatch('irs_plan/get_current_plan')
          .then(() => { this.$store.commit('root:set_loading', false) })
          .catch(() => { this.$store.commit('root:set_loading', false) })

      },
      save_plan() {
        
        const target_areas = cache.geodata.all_target_areas.features.filter(feature => {
          return this.selected_target_area_ids.includes(feature.properties[this.denominator_def.field_name])
        })

        const key_name = Object.keys(this.denominator_def.denominator.fields)[0]
        const denominator_field_name = this.denominator_def.denominator.fields[key_name]

        const denominator = target_areas.map((area) => {
          const obj = {}
          obj[key_name] = area.properties[denominator_field_name]
          obj[this.denominator_def.field_name] = area.properties[this.denominator_def.field_name]
          return obj
        })
        
        this.$store.commit('root:set_loading', true)
        this.$store.dispatch('irs_plan/save_plan', denominator)
          .then(() => {
            this.$store.commit('root:set_snackbar', {message: 'Successful save'})
            this.$store.commit('root:set_loading', false)
          })
          .catch(() => {
            this.$store.commit('root:set_snackbar', {message: 'Not saved. Something wrong.'})
            this.$store.commit('root:set_loading', false)
          })
      },
      clear_plan() {
        this.$store.commit('irs_plan/clear_plan')
      }
    }
  }
</script>

<style scoped>
  .container {
    margin: 0 auto;
    width: 90%;
    padding: 10px;
  }

  .card {
    margin-top: 10px;
  }

  .md-chip {
    background: orange;
    color: white;
  }


</style>
