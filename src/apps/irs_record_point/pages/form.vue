<template>
  <survey :survey="survey"></survey>
</template>

<script>
  import * as Survey from 'survey-vue'
  
  export default {
    name: 'form',
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
      'survey.data': 'update_form_response'
    },
    methods: {
      create_form() {
        this.survey = new Survey.Model(this.form)
        
        // Hide 'Complete' button
        this.survey.onAfterRenderSurvey(() => {
          console.log('survey rendered')
        })
          // window.el = this.$el
          // this.$el.querySelector("input[value='Complete']").remove()

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
