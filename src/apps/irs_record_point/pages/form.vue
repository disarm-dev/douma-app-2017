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
        <!--<md-button v-if="show_back_to_location" @click.native="$emit('previous_view')" class="md-raised">Previous</md-button>-->

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

  import flatten from 'lodash.flatten'

  export default {
    name: 'form',
    props: ['initial_form_data', 'response_is_valid', 'validations'],
    data () {
      return {
        // UI
        show_back_to_location: true,

        // SurveyJS navigation proxies
        show_previous: false,
        show_next: false,
        show_complete: false,

        next_disabled: false,
        complete_disabled: false,

        // Data
        _survey: {},
      }
    },
    watch: {
      // TODO: Combine following watchers
      'response_is_valid': 'control_complete_button_visibility',
      'response_is_valid': 'control_next_button_disabled',
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
        this._survey.onValueChanged.add(this.on_form_data_change)
        this._survey.onCurrentPageChanged.add(this.on_page_change)

        if (this.initial_form_data !== null) {
          this._survey.data = this.initial_form_data
        }
      },
      on_form_data_change() { // Called from SurveyJS #onCurrentPageChanged
        this.$emit('change', this._survey)
        this.control_navigation()
      },
      on_page_change() { // Called from SurveyJS #onValueChanged
        this.control_navigation()
      },

      control_navigation() {
        this.control_back_to_location_visibility()

        this.control_next_button_visibility()
        this.control_previous_button_visibility()
        this.control_complete_button_visibility()

        this.control_next_button_disabled()
      },
      control_back_to_location_visibility() {
        this.show_back_to_location = this._survey.isFirstPage
      },
      control_next_button_visibility() {
        this.show_next = !this._survey.isLastPage
        console.log('control_next_button_visibility', this.show_next)
      },
      control_previous_button_visibility() {
        this.show_previous = !this._survey.isFirstPage
      },
      control_complete_button_visibility() {
        // TODO: Any ideas why we need $nextTick here, other than 'to make it work'
        this.$nextTick(() => {
          this.show_complete = false
          this.complete_disabled = true

          if (Object.keys(this._survey.data).length === 0) {
            // No questions answered
            return
          }

          // Accessing #isCurrentPageHasErrors triggers SurveyJS validations
          if (this._survey.isLastPage && (this._survey.isCurrentPageHasErrors || !this.response_is_valid)) {
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
      control_next_button_disabled() {
        this.next_disabled = false

        const question_names = this.validations.errors.reduce((questions_array, err) => {
          return questions_array.concat(err.questions)
        }, [])

        const question_indices = question_names.map((question_name) => {
          const question = this._survey.getQuestionByName(question_name)
          const page = this._survey.getPageByQuestion(question)

          const question_name_index = this._survey.pages.findIndex((survey_page) => {
            return survey_page.id === page.id
          })

          return question_name_index
        })

        const last_page_with_error = Math.max(...question_indices)

        const current_page_index = this._survey.pages.findIndex((survey_page) => {
          return this._survey.currentPage.id === survey_page.id
        })

        if (last_page_with_error === current_page_index) {
          this.next_disabled = true
        }
      },
      next_page() { this._survey.nextPage() },
      previous_page() { this._survey.prevPage() },
      complete() { this.$emit('complete', this._survey) }
    }
  }
</script>

<style scoped>
  .md-card {
    margin: 10px;
  }
</style>
