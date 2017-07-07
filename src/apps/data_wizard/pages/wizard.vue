<template>
  <md-stepper md-vertical class="container" @change='change' @completed="completed">
    <md-step v-for='{title, description, remote_source} in steps' :key='{title}' :md-label="title" :md-message="description">
      <p><md-icon class='step-icon'>extension</md-icon> {{remote_source}}</p>

      <p><md-icon class='step-icon'>file_upload</md-icon>Upload your own data which matches this <router-link to=''>schema</router-link></p>
    </md-step>
  </md-stepper>
</template>

<script>

  export default {
    name: 'wizard',
    mounted() {
    },
    data() {
      return {
        steps: [
          {
            title: 'instance-area',
            description: 'Area of interested: search for country, region, etc.',
            remote_source: 'DiSARM Region selection Tool / Generic bounding box'
          },
          {
            title: 'enumeration-structures',
            description: 'Smallest targeting unit',
            remote_source: 'OSM Buildings extract'
          },
          {
            title: 'sprayable-structures',
            description: 'Determine which structures are sprayable',
            remote_source: 'DiSARM Sprayable Buildings API'
          },
          {
            title: 'risk',
            description: 'Identify highest priority areas',
            remote_source: 'MAP Map / DiSARM Automated Risk Map API'
          },
          {
            title: 'population',
            description: 'Human population layer',
            remote_source: 'WorldPop'
          },
          {
            title: 'admin_levels',
            description: 'Regions, wards, districts, etc',
            remote_source: 'GADM or Natural Earth'
          },
          {
            title: 'planning_level',
            description: 'Operational planning level - either select from admin levels, or cluster something',
            remote_source: 'DiSARM Enumeration Clustering API'
          },
          {
            title: 'form',
            description: 'Data collection form',
            remote_source: 'DiSARM Survey generator Tool (based on SurveyJS)'
          },
          {
            title: 'validations',
            description: 'Describe checks to ensure good quality data collection',
            remote_source: 'DiSARM Validation Tool'
          },
          {
            title: 'aggregations',
            description: 'Describe how you want to aggregate your data (based on ',
            remote_source: 'DiSARM Aggregation Tool'
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
