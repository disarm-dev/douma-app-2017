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
  import {mapState} from 'vuex'

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
        denominator: state => state.instance_config.denominator,
        slug: state => state.instance_config.slug,
        selected_target_area_ids: state => state.irs_plan.selected_target_area_ids,
        unsaved_changes: state => state.irs_plan.unsaved_changes,
        online: state => state.network_online
      }),
      can_clear() {
        return this.selected_target_area_ids.length !== 0
      }
    },
    mounted() {
      this.$store.dispatch('irs_plan/get_geodata', {slug: this.slug, level: this.denominator.aggregate_to, cache})
        .then(() => this.data_ready = true)
    },
    methods: {
      load_plan() {
        this.$store.commit('root:set_loading', true)

        this.$store.dispatch('irs_plan/get_current_plan')
          .then(() => { this.$store.commit('root:set_loading', false) })
          .catch(() => { this.$store.commit('root:set_loading', false) })

      },
      save_plan() {
        this.$store.commit('root:set_loading', true)
        this.$store.dispatch('irs_plan/save_plan')
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
