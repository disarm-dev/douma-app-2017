<template>
  <v-touch
    :options="{touchAction: 'pan-y'}"
    v-on:swipeleft="next_page"
    v-on:swiperight="previous_page">

    <div id="surveyContainer"></div>

    <md-button v-if="show_previous" @click.native="previous_page"class="md-raised">Previous</md-button>
    <md-button v-if="show_next" @click.native="next_page"class="md-raised">Next</md-button>
    <md-button v-if="show_complete" :disabled="complete_disabled" @click.native="complete"class="md-raised md-primary">Complete</md-button>
  </v-touch>
</template>

<script>
  import * as Survey from 'survey-knockout'
  import 'survey-knockout/survey.css'

  export default {
    name: 'form',
    props: ['initial_form_data', 'response_is_valid'],
    data () {
      return {
        _survey: {},
        show_previous: false,
        show_next: true,
        show_complete: false,
        complete_disabled: false
      }
    },
    watch: {
      'response_is_valid': 'control_complete_button_visibility'
    },
    created() {
      // Configure form
    },
    mounted(){
      this.create_form()
    },
    methods: {
      create_form() {
        const form_options = {
          ...this.$store.state.instance_config.form,
          showNavigationButtons: false
        }

        // KNOCKOUT
        this._survey = new Survey.Model(form_options, "surveyContainer")
        this._survey.onValueChanged.add(this.on_form_change)
        this._survey.onCurrentPageChanged.add(this.on_page_changed)

        if (this.initial_form_data) {
          this._survey.data = this.initial_form_data
        }
      },
      on_page_changed() {
        this.control_navigation_visibility()
        this.control_complete_button_visibility()
      },
      on_form_change() {
        this.$emit('change', this._survey)
        this.control_complete_button_visibility()
      },
      control_navigation_visibility() {
        this.show_next = false
        this.show_previous = false

        if (!this._survey.isLastPage) this.show_next = true
        if (!this._survey.isFirstPage) this.show_previous = true
      },
      control_complete_button_visibility() {
        this.$nextTick(() => {
          this.show_complete = false
          this.complete_disabled = true

          if (Object.keys(this._survey.data).length === 0) {
            // No questions answered
            return
          }

          if (this._survey.isLastPage && (this._survey.isCurrentPageHasErrors || !this.response_is_valid)) {
            console.log(this._survey.isLastPage)
            // Last page, but with errors

            this.show_complete = true
            this.complete_disabled = true
            return
          }

          if (this._survey.isLastPage && this.response_is_valid && !this._survey.isCurrentPageHasErrors) {
            // All good, complete!
            this.show_complete = true
            this.complete_disabled = false
            return
          }
        })
      },
      next_page() {
        this._survey.nextPage()
      },
      previous_page() {
        this._survey.prevPage()
      },
      complete() {
        this.$emit('complete', this._survey)
      }
    }
  }
</script>
