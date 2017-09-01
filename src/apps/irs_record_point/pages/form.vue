<template>
  <v-touch
    :options="{touchAction: 'pan-y'}"
    v-on:swipeleft="next_page"
    v-on:swiperight="previous_page">

    <md-card>
      <md-card-header>
        <div class="md-title">Form</div>
      </md-card-header>

      <md-card-content>
        <div id="surveyContainer"></div>
      </md-card-content>

      <md-card-actions>
        <!--Only for first page, take you back to Location tab/page -->
        <md-button v-if="show_back_to_location" @click.native="$emit('previous_view')" class="md-raised">Previous</md-button>

        <!-- SurveyJS navigation proxies -->
        <md-button v-if="show_previous" @click.native="previous_page" class="md-raised">Previous</md-button>
        <md-button v-if="show_next" :disabled="next_disabled" @click.native="next_page" class="md-raised">Next</md-button>
        <md-button v-if="show_complete" :disabled="complete_disabled" @click.native="complete" class="md-raised md-primary">Complete</md-button>
      </md-card-actions>
    </md-card>

  </v-touch>
</template>

<script>
  import * as Survey from 'survey-knockout'
  import 'survey-knockout/survey.css'

  export default {
    name: 'form',
    props: ['initial_form_data', 'response_is_valid', 'validations', 'current_view'],
    data() {
      return {
        // UI
        show_back_to_location: true,

        // SurveyJS navigation proxies
        show_previous: false,
        show_next: false,
        show_complete: false,

        next_disabled: true,
        complete_disabled: true,

        // Data
        _survey: {},
      }
    },
    watch: {
      'response_is_valid': 'control_navigation',
      'current_view': 'control_navigation'
    },
    mounted() {
      this.create_form()
    },
    methods: {
      create_form() {
        const form_options = {
          ...this.$store.state.instance_config.form,
          showNavigationButtons: false
        }

        // KNOCKOUT
        this._survey = new Survey.Model(form_options, 'surveyContainer')
        this._survey.onValueChanged.add(this.on_form_data_change)
        this._survey.onCurrentPageChanged.add(this.on_page_change)

        if (this.initial_form_data !== null) {
          this._survey.data = this.initial_form_data
        }
      },
      on_form_data_change() { // Called from SurveyJS #onCurrentPageChanged
        this.$emit('change', this._survey) // For validations
        this.control_navigation()
      },
      on_page_change() { // Called from SurveyJS #onValueChanged
        this.control_navigation()
      },
      is_single_page_form() {
        return this._survey.isFirstPage && this._survey.isLastPage
      },


      control_navigation() {
        this.$nextTick(() => {
          // All buttons off and disabled
          this.reset_navigation()

          // Back to location or previous question
          this.control_previous_and_location_button_visibility()

          // Handle single_page_forms differently to avoid 'red screen of errors'
          if (this.is_single_page_form()) {
            this.control_single_page_form_complete()
          } else {
            this.control_next_button_visibility()
            this.control_complete_button_visibility()
            this.control_next_button_disabled()
          }

        })
      },
      reset_navigation() {
        // SurveyJS navigation proxies
        this.show_previous = false
        this.show_next = false
        this.show_complete = false

        this.next_disabled = true
        this.complete_disabled = true
      },
      control_previous_and_location_button_visibility() {
        this.show_previous = !this._survey.isFirstPage
        this.show_back_to_location = !this.show_previous
      },
      control_next_button_visibility() {
        this.show_next = !this._survey.isLastPage
      },
      control_complete_button_visibility() {
        const is_single_page_or_last_page = (this.is_single_page_form()) || this._survey.isLastPage

        // No questions answered (will need solving again when we fix the 'screen of red errors')
//        if (!is_single_page_or_last_page && Object.keys(this._survey.data).length === 0) return

        // Last page (or single-page), but with errors
        // Accessing #isCurrentPageHasErrors triggers SurveyJS validations
        if (is_single_page_or_last_page && (this._survey.isCurrentPageHasErrors || !this.response_is_valid)) {
          this.show_complete = true
          this.complete_disabled = true
          return
        }

        // Last page (or single-page), no errors. All good, complete!
        if (is_single_page_or_last_page && this.response_is_valid && !this._survey.isCurrentPageHasErrors) {
          this.show_complete = true
          this.complete_disabled = false
          return
        }
      },
      control_next_button_disabled() {
        // 'next' is disabled if:
        // - there are SurveyJS form_errors on current page
        // - there are validation_errors relating to the current page

        // check if the current page is the last page which has a validation_error
        // you can go backwards to fix validation_errors, but not forwards past the last page
        // which currently has a validation_error


        // get names of all questions answered (from validations)
        const questions_answered_names = this.validations.errors
          .filter(error => !error.is_location)
          .reduce((questions_array, err) => {
            return questions_array.concat(err.questions)
          }, [])

        // get page indices for every page with an answered question
        const question_page_indices = questions_answered_names.map((question_name) => {
          const question = this._survey.getQuestionByName(question_name)
          const page = this._survey.getPageByQuestion(question)

          const question_name_index = this._survey.pages.findIndex((survey_page) => {
            return survey_page.id === page.id
          })

          return question_name_index
        })

        // find last page with a VALIDATION error (good variable name!)
        const last_page_with_validation_error_index = Math.max(...question_page_indices)

        // get current page index, to compare with pages with errors
        const current_page_index = this._survey.pages.findIndex((survey_page) => {
          return this._survey.currentPage.id === survey_page.id
        })



        const has_form_errors = this._survey.isCurrentPageHasErrors
        const has_validation_errors = (last_page_with_validation_error_index === current_page_index)


        if (has_form_errors || has_validation_errors) {
          // either: 1) there are SurveyJS form_errors, or 2) you're on the last page with a validation_error
          // so, you cannot continue
          this.next_disabled = true
        } else {
          // CARRY ON
          this.next_disabled = false
        }


      },
      control_single_page_form_complete() {
        this.show_complete = true
        this.complete_disabled = false
      },

      // Navigation
      next_page() { this._survey.nextPage() },
      previous_page() { this._survey.prevPage() },
      complete() {
        // Cannot complete a single-page form with errors - we won't have checked until first time
        // 'complete' is clicked
        if (this.is_single_page_form() && this._survey.isCurrentPageHasErrors) return

        // If not a single_page_form, and you can click 'complete', then you're probably ok.
        if (this._survey.isCurrentPageHasErrors) return console.warn("Errors in (non single-page form), should not be able to click 'complete'")
        this.$emit('complete', this._survey)
      }
    }
  }
</script>

<style scoped>
  .md-card {
    margin: 10px;
  }
</style>
