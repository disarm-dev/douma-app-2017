<template>
  <div class="applet_container">
    <div class="md-title">DiSARM Data Wizard</div>

    <md-progress :md-progress="(step_page / steps.length) * 100"></md-progress>
    <div>
      {{step_page}} of {{steps.length}}
    </div>

    <div>
      <!--BACK (it's just back, except for first page -->
      <md-button :disabled='!has_prev' class='md-primary md-raised' @click.native="back">back</md-button>

      <!-- FORWARD (now this is more complicated - needs to be NEXT, CREATE or SAVE, depending on step) -->
      <md-button v-if="!is_create_step && !is_finish_step" :disabled='!has_next' class='md-primary md-raised' @click.native="next">next</md-button>
      <md-button v-if='is_create_step' class='md-accent md-raised' @click.native="create">create</md-button>
      <md-button v-if='is_finish_step' class='md-accent md-raised' @click.native="finish">finish</md-button>
    </div>

    <component :is="steps[step_page - 1].name" @next="next" @back="back"></component>

  </div>
</template>

<script>

  // Geodata
  import select_country from './steps/select_country.vue'
  import configure_admin_levels from './steps/configure_admin_levels'
  import configure_geodata from './steps/configure_geodata.vue'
  import create_form from './steps/create_form.vue'
  import create_validations from './steps/create_validations.vue'
  import create_aggregations from './steps/create_aggregations.vue'
  import configure_applets from './steps/configure_applets.vue'
  import configure_presenters from './steps/configure_presenters.vue'
  import review_configuration from './steps/review_configuration.vue'
  import result from './steps/result.vue'

  const steps = [
    select_country,
    configure_admin_levels,
    configure_geodata,
    create_form,
    create_validations,
    create_aggregations,
    configure_applets,
    configure_presenters,
    review_configuration,
    result
  ]

  const components = steps.reduce((acc, step) => {acc[step.name] = step; return acc}, {})

  export default {
    components,
    name: 'wizard',
    props: ['step_param'],
    data() {
      return {
        steps
      }
    },
    computed: {
      step_page() {
        return parseInt(this.step_param, 10)
      },
      has_next() {
        return this.step_page < (this.steps.length)
      },
      has_prev() {
        return this.step_page > 1
      },
      is_create_step() {
        return this.step_page === (this.steps.length - 1)
      },
      is_finish_step() {
        return this.step_page === this.steps.length
      }
    },
    mounted() {
      if (this.step_page > steps.length) this.$router.push('/data/wizard/1')
      if (this.step_page < 1) this.$router.push('/data/wizard/1')
    },
    methods: {
      back() {
        if (this.step_page === 1) return
        this.$router.push(`/data/wizard/${+this.step_page - 1}`)
      },
      next() {
        this.$router.push(`/data/wizard/${+this.step_page + 1}`)
        },
      create() {
        this.$router.push(`/data/wizard/${+this.step_page + 1}`)
      },
      finish() {
        console.log('confirm finish of instance files')
      }
    }
  }
</script>

<style scoped>
  .card {
    margin: 1em auto;
  }
</style>
