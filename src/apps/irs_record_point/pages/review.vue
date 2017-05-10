<template>
  <div>
    <router-link class='md-button md-raised' to='/irs/record_point'><md-icon>create</md-icon>Add new</router-link>
    <ul>
      <li v-for='response in responses' :index='response'>
        <router-link :to="{name: 'irs_record_point:edit', params: {response_id: response.id}}">{{response.id}}</router-link>
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
      }
    },
    computed: {
      ...mapState({
        responses: state => state.irs_record_point.responses
      })
    }
  }
</script>

<style lang="css" scoped>
</style>