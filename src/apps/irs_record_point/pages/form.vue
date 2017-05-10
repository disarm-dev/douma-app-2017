<template>
  <survey :survey="survey"></survey>
</template>

<script>
  import * as Survey from 'survey-vue'
  
  export default {
    name: 'form',
    props: ['existing_form_data'],
    data () {
      return {
        survey: {},
      }
    },
    computed: {
      form() {
        return this.$store.state.instance_config.form
      }
    },
    watch: {
      'form': 'create_form',
    },
    mounted() {
      this.create_form()
    },
    methods: {
      create_form() {
        this.survey = new Survey.Model(this.form)
         
        if (this.existing_form_data) {
          this.survey.data = this.existing_form_data
        }

        // Hide 'Complete' button
        this.$nextTick(() => {
          this.$el.querySelector("input[value='Complete']").remove()
        })

      },
      update_form_response() {
        this.$emit('change', this.survey.data)
      }
    }
  }
</script>

<style lang="css" scoped>
  .container {
    margin: 10px;
  }
</style>
