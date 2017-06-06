<template>
  <div>
    <div id="surveyContainer"></div>
    <md-button v-if="show_previous" @click.native="previous_page"class="md-raised">Previous</md-button>
    <md-button v-if="show_next" @click.native="next_page"class="md-raised">Next</md-button>
    <md-button v-if="show_complete" @click.native="complete"class="md-raised md-primary">Complete</md-button>
  </div>
</template>

<script>
  import * as Survey from 'survey-jquery'

  export default {
    name: 'form',
    props: ['initial_form_data', 'response_is_valid'],
    data () {
      return {
        _survey: {},
        show_previous: false,
        show_next: true,
        show_complete: false
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
        completeText: "Save",
        showNavigationButtons: false
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
          onCurrentPageChanged: this.on_page_change
        });

      },
      on_page_change() {
        if (this._survey.isLastPage) {
          this.show_next = false
        } else {
          this.show_next = true
        }

        if (this._survey.isFirstPage) {
          this.show_previous = false
        } else {
          this.show_previous = true
        }

        if (this._survey.isLastPage && this.response_is_valid) {
          this.show_complete = true
        } else {
          this.show_complete = false
        }
      },
      on_form_change() {
        this.$emit('change', this._survey.data)
      },

      next_page() {
        this._survey.nextPage()
      },
      previous_page() {
        this._survey.prevPage()
      },
      complete() {
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
