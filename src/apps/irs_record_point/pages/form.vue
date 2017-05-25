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
    created() {
      let goNextPageAutomatic = true
      if (this.existing_form_data) {
        goNextPageAutomatic = false
      }
      this.form = this.$store.state.instance_config.form
      this.form = {
        ...this.form,
        goNextPageAutomatic,
        completeText: "Start review/validation"
      }
    },
    mounted(){
      this.create_form()
    },
    methods: {
      create_form() {
        // TODO: @feature Destroy form on exit (#beforeDestroy)
        this.survey = new Survey.Model(this.form)

        if (this.existing_form_data) {
          this.survey.data = this.existing_form_data
        }

        const el = $("#surveyContainer")

        el.Survey({
          model: this.survey,
          onComplete: this.complete_form
        });

      },
      complete_form() {
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
