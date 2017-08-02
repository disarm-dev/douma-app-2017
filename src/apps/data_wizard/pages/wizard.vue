<template>
  <div class="applet_container">
    <div class="md-title">DiSARM Data Wizard</div>

    <div>
      {{step + 1 }} of {{steps.length}}
    </div>

    <component :is="steps[step].name"></component>

    <div>
      <md-button @click.native="back">back</md-button>
      <md-button @click.native="next">next</md-button>
    </div>
  </div>
</template>

<script>
  import complete from './steps/complete.vue'
  import configure_applets from './steps/configure_applets.vue'
  import configure_geodata from './steps/configure_geodata.vue'
  import configure_presenters from './steps/configure_presenters.vue'
  import create_aggregations from './steps/create_aggregations.vue'
  import create_form from './steps/create_form.vue'
  import create_validations from './steps/create_validations.vue'

  const steps = [
    configure_geodata,
    create_form,
    create_validations,
    create_aggregations,
    configure_applets,
    configure_presenters,
    complete
  ]

  export default {
    components: {configure_geodata, create_form, create_validations, create_aggregations, configure_applets, configure_presenters},
    name: 'wizard',
    data() {
      return {
        step: 0,
        steps
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
