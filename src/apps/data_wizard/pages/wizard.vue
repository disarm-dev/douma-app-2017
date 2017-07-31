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
  import configure_geodata from './configure_geodata.vue'
  import create_form from './create_form.vue'
  import create_validations from './create_validations.vue'
  import create_aggregations from './create_aggregations.vue'
  import configure_applets from './configure_applets.vue'
  import configure_presenters from './configure_presenters.vue'

  const steps = [
    configure_geodata,
    create_form,
    create_validations,
    create_aggregations,
    configure_applets,
    configure_presenters
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
