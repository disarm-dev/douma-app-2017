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
        <md-button v-if="show_back_to_location" @click.native="$emit('previous_view')" class="md-raised">Previous</md-button>
        <md-button v-if="show_previous" @click.native="previous_page" class="md-raised">Previous</md-button>
        <md-button v-if="show_next" @click.native="next_page" class="md-raised">Next</md-button>
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
    props: ['initial_form_data', 'response_is_valid'],
    data () {
      return {
        _survey: {},
        show_back_to_location: true,
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

        if (this.initial_form_data !== null) {
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
        console.log('check whats going on')
        this.show_back_to_location = false
        this.show_next = false
        this.show_previous = false

        if (this._survey.isFirstPage) this.show_back_to_location = true
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

<style scoped>
  .md-card {
    margin: 10px;
  }
</style>

