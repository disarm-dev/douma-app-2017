<template>
  <div>Filters for all fields</div>
</template>

<script>
  import {mapState} from 'vuex'
  import {get_form_fields} from 'lib/instance_data/form_helpers'

  export default {
    name: 'field-filters',
    props: ['responses'],
    mounted() {
    },
    data() {
      return {}
    },
    computed: {
      ...mapState({
        form: state => state.instance_config.form
      })
    },
    mounted() {
      const fields = get_form_fields(this.form)
      console.log(fields, this.responses.length)
      // get all options for each form field
    },
    methods: {}
  }
</script>

<style scoped>

</style>
