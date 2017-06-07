<template>
  <v-touch v-on:swipeleft="next_page" v-on:swiperight="previous_page">
    <div id="surveyContainer"></div>
    <md-button v-if="show_previous" @click.native="previous_page"class="md-raised">Previous</md-button>
    <md-button v-if="show_next" @click.native="next_page"class="md-raised">Next</md-button>
    <md-button v-if="show_complete" @click.native="complete"class="md-raised md-primary">Complete</md-button>
  </v-touch>
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
      'response_is_valid': 'control_complete_button_visibility'
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
        this.show_next = false
        this.show_previous = false
        this.show_complete = false

        if (!this._survey.isLastPage) this.show_next = true
        if (!this._survey.isFirstPage) this.show_previous = true

        this.control_complete_button_visibility()
      },
      on_form_change() {
        this.$emit('change', this._survey.data)

        this.control_complete_button_visibility()
      },
      control_complete_button_visibility() {
        if (this._survey.isLastPage && this.response_is_valid && !this._survey.isCurrentPageHasErrors) {
          this.show_complete = true
        } else {
          this.show_complete = false
        }
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
