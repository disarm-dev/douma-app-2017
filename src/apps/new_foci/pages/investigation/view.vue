<template>
  <investigation-map :foci="foci"></investigation-map>
</template>

<script>
  import InvestigationMap from './map.vue'

  export default {
    name: 'InvestigationView',
    props: ['foci_id'],
    components: {InvestigationMap},
    watch: {
    },
    mounted() {
    },
    data () {
      return {
        
      }
    },
    computed: {
      foci() {
        return this.$store.state.foci.focis.find(f => f.properties._id == this.foci_id)
      }
    },
    methods: {

    }

  }
</script>