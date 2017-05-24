<template>
  <div id="surveyContainer"></div>
</template>

<script>
  import * as Survey from 'survey-jquery'

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
    mounted() {
      this.create_form()
    },
    methods: {
      create_form() {

        this.survey = new Survey.Model(this.form)

        if (this.existing_form_data) {
          this.survey.data = this.existing_form_data
        }
        
        const el = $("#surveyContainer")

        el.Survey({
          model: this.survey,
          onComplete: this.update_form_response
        });

      },
      update_form_response() {
        this.$emit('complete', this.survey.data)
      },
    }
  }
</script>

<style lang="css" scoped>
  .container {
    margin: 10px;
  }
</style>
