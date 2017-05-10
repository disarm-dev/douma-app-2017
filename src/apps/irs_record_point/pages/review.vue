<template>
  <div>
    <ul>
      <li v-for='response in responses' :index='response'>
        {{response.date}} {{response.location.type}} ({{response.location.point.longitude}}, {{response.location.point.latitude}})
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {

    name: 'review',

    data () {
      return {

      };
    },
    computed: {
      ...mapState({
        responses: state => state.irs_record_point.responses
      })
    }
  };
</script>

<style lang="css" scoped>
</style>