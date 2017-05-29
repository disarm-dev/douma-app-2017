<template>
  <div id="surveyContainer"></div>
</template>

<script>
  import * as Survey from 'survey-jquery'

  export default {
    name: 'form',
    props: ['initial_form_data', 'response_is_valid'],
    data () {
      return {
        _survey: {},
      }
    },
    watch: {
      'response_is_valid': 'render_save_button'
    },
    created() {
      let goNextPageAutomatic = true
      if (this.initial_form_data) {
        goNextPageAutomatic = false
      }
      this.form = this.$store.state.instance_config.form
      this.form = {
        ...this.form,
        goNextPageAutomatic,
        completeText: "Save"
      }
    },
    mounted(){
      this.create_form()
    },
    methods: {
      render_save_button() {
        if (!this._survey.isLastPage) return

        if (this.response_is_valid) {

        } else {

        }
      },
      create_form() {
        // TODO: @feature Destroy form on exit (#beforeDestroy)
        this._survey = new Survey.Model(this.form)

        if (this.initial_form_data) {
          this._survey.data = this.initial_form_data
        }

        const el = $("#surveyContainer")

        el.Survey({
          model: this._survey,
          onValueChanged: this.on_form_change,
          onComplete: this.on_form_complete
        });

      },
      on_form_change() {
        this.$emit('change', this._survey.data)
      },
      on_form_complete() {
        this.$emit('complete', this._survey.data)
      }
    }
  }
</script>

<style lang="css" scoped>
  .container {
    margin: 10px;
  }
</style>
