<template>
  <div class="container" >
    <md-stepper md-vertical @change='change' @completed="completed">
      <md-step v-for='{title, description, remote_source} in steps' :key='{title}' :md-label="title">
        <md-radio v-model="test1" md-value="1">Use default sources (MAP, AfriPop, etc)</md-radio>
        <md-radio v-model="test1" md-value="2">Upload your own data</md-radio>
      </md-step>
    </md-stepper>
    <md-button class="md-raised md-warn">Create DiSARM</md-button>
  </div>
</template>

<script>

  export default {
    name: 'wizard',
    mounted() {
    },
    data() {
      return {
        test1: true,
        steps: [
          {
            title: 'Integrate data',
          },
          {
            title: 'Select analyses',
          },
          {
            title: 'Configure applications',
          },
        ]
      }
    },
    methods: {
      change(step) {
        console.log('changed to step ', step)
      },
      completed() {
        console.log('completed')
      }
    }
  }
</script>

<style scoped>
  .step-icon {
    color: #bbc7d0
  }
</style>
