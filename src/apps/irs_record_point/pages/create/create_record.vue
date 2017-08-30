<template>
  <div class='record-container'>

    <div class="record-controls">

      <!--BACK TO LIST-->
      <md-button class="md-icon-button" @click="close_form">
        <md-icon>arrow_back</md-icon>
      </md-button>

      <!--VALIDATIONS CARD TOGGLE-->
        <md-button
          class="animated"
          :class="{orange: have_warnings, red: have_errors, 'md-raised': !show_validation_result, shake: shake_button}"
          :disabled="validation_result_empty"
          @click.native="toggle_show_validation_result"
        >

          <span v-if="!validation_result_empty">
            {{validation_result.errors.length + validation_result.warnings.length}}
          </span>

          {{ validation_result_empty ? "No validation issues" : (validation_length  === 1 ? "Validation issue" : "Validation issues")}}
        </md-button>
    </div>

    <!-- CONFIRM CLOSE FORM -->
    <md-dialog-confirm
      md-title="Closing form - you will lose any changes"
      md-content-html="Do you want to continue?"
      md-ok-text="continue"
      md-cancel-text="cancel"
      @close="respond_to_close_form_confirm"
      ref="close_form_confirm">
    </md-dialog-confirm>


    <!--VALIDATION CARD-->
    <transition name="slide-fade">
      <md-card v-show="show_validation_result">
        <review
          ref="validation_result"
          :validations='validation_result'
          :survey="survey_for_validation_review"
          v-on:show_location="set_current_view('location')"
        ></review>
        <md-card-actions>
          <md-button @click.native="show_validation_result = false">Hide</md-button>
        </md-card-actions>
      </md-card>
    </transition>


    <!-- METADATA EDITOR (PAGE 1)-->
    <md-card v-show="current_view === 'metadata'">
      <md-card-content>
        <md-card-header>
          <div class="md-title">Metadata</div>
        </md-card-header>
        <md-list>
          <md-list-item>
            <md-input-container>
              <label>username</label>
              <md-input disabled v-model="response.username"></md-input>
            </md-input-container>
          </md-list-item>
          <md-list-item>
            <md-input-container>
              <label>team name (optional)</label>
              <md-input v-model.lazy="response.team_name" @input="team_name_changed"></md-input>
            </md-input-container>
          </md-list-item>
          <md-list-item>
            <md-input-container>
              <label>Date recorded on</label>
              <md-input disabled type='text' v-model="formatted_recorded_on"></md-input>
            </md-input-container>
          </md-list-item>
          <!--<md-input-container>-->
            <!--<label>Team</label>-->
            <!--<md-input v-model="response.team_name"></md-input>-->
          <!--</md-input-container>-->
        </md-list>

      </md-card-content>
      <md-card-actions>
        <md-button @click.native="set_current_view('location')" class="md-raised">Next</md-button>
      </md-card-actions>
    </md-card>

    <!--LOCATION CARD (PAGE 2)-->
    <md-card v-show="current_view === 'location'" class='location'>
      <md-card-content>
        <md-card-header>
          <div class="md-title">Location</div>
        </md-card-header>

        <location_coords
          @change='on_location_change'
          :initial_location='response.location.coords'
        ></location_coords>

      <location_selection
        @change="on_location_selection_selected"
        :initial_location_selection="response.location.selection"
      >
      </location_selection>

      </md-card-content>
      <md-card-actions>
        <md-button @click.native="set_current_view('metadata')" class="md-raised">Previous</md-button>
        <md-button @click.native="set_current_view('form')" class="md-raised">Next</md-button>
      </md-card-actions>
    </md-card>


    <!--FORM-->
    <form_renderer
      v-show="current_view === 'form'"
      ref="form"
      @complete='on_form_complete'
      @change="on_form_data_change"
      @previous_view="set_current_view('location')"
      :initial_form_data='response.form_data'
      :current_view="current_view"
      :response_is_valid="response_is_valid"
      :validations='validation_result'
    ></form_renderer>

  </div>
</template>

<script>
  import {mapState} from 'vuex'

  import {Response} from 'lib/models/response.model'
  import {Validator} from 'lib/instance_data/validations'

  import location_coords from './location/location_coords.vue'
  import location_selection from './location/location_selection'
  import review from './validations/validation.vue'
  import form_renderer from './form_renderer.vue'

  export default {
    name: 'Record',
    components: {location_coords, location_selection, form_renderer, review},
    props: ['response_id'],
    data () {
      return {
        // User data
        _response: null, // This is the only response which exists

        // Support
        _validator: null,
        survey_for_validation_review: null, // TODO: @refac Should only be in one place, currently created on form_renderer

        // Validation result will return object looking like this:
        validation_result: {
          errors: [],
          warnings: []
        },
        show_validation_result: false,
        show_location: false,

        // UI
        shake_button: false,
        pages: ['metadata', 'location', 'form'],
        current_view: 'metadata'
      }
    },
    watch: {
      'validation_length': 'shake_validations'
    },
    computed: {
      ...mapState({
        username: state => state.meta.user.username,
        instance_slug : state => state.instance_config.instance.slug,
        instance_config: state => state.instance_config,
        team_name: state => state.irs_record_point.team_name
      }),
      formatted_recorded_on() {
        return this.response.recorded_on + ""
      },
      response() {
        return this._response.model
      },
      response_is_valid() {
        return (this.validation_result.errors.length === 0)
      },
      validation_result_empty() {
        return (this.validation_result.errors.length === 0) && (this.validation_result.warnings.length === 0)
      },
      have_errors() {
        return this.validation_result.errors.length
      },
      have_warnings() {
        return this.validation_result.warnings.length
      },
      validation_length() {
        return this.validation_result.errors.length  + this.validation_result.warnings.length
      }
    },
    created() {
      this._validator = new Validator(this.instance_config.validations)

      if (this.response_id) {
        const found = this.$store.state.irs_record_point.responses.find(r => r.id === this.response_id)
        this._response = new Response(found)
      } else {
        const empty_response = {
          username: this.username,
          instance_slug: this.instance_slug,
          team_name: this.team_name
        }
        this._response = new Response(empty_response)
      }
    },
    mounted() {
    },
    methods: {
      set_current_view(view) {
        this.current_view = view
      },
      shake_validations(newVal, oldVal) {
        if (newVal > oldVal) {
          this.shake_button = !this.shake_button
          setTimeout(() => {
            this.shake_button = !this.shake_button
          }, 2000)
        }
      },
      toggle_show_validation_result() {
        this.show_validation_result = !this.show_validation_result
      },
      on_location_change(coords) {
        this.response.location.coords = coords
        this.validate(this.response)
      },
      on_location_selection_selected(location_selection){
        this.response.location.selection = location_selection
        this.validate(this.response)
      },
      on_form_data_change(survey) { // Event from form_renderer
        this.response.form_data = survey.data
        this.survey = survey
        this.validate(this.response)
      },
      on_form_complete(survey) { // Event from form_renderer
        this.on_form_data_change(survey)

        if (this.response_is_valid) {
          this.save_response()
        } else {
          console.log('No idea what we do here.')
        }
      },
      validate(response) {
        this.validation_result = this._validator.validate(response)
        if (this.validation_result_empty) this.show_validation_result = false

        // Events
        const non_location_errors = this.validation_result.errors.filter(r => !r.is_location).length
        if (non_location_errors) {
          this.$ga.event('irs_record','validation_issues', 'errors', this.validation_result.errors.map(r => r.name).join('.'))
        }
        if (this.validation_result.warnings.length) {
          this.$ga.event('irs_record','validation_issues', 'warning', this.validation_result.warnings.map(w => w.name).join('.'))
        }
      },
      save_response() {
        debugger
        const decorated_response = this._response.decorate_for_sending()

        if (this.response_id) {
          this.update_response(decorated_response)
        } else {
          this.create_response(decorated_response)
        }
      },
      create_response(response) {
        this.$store.commit('irs_record_point/create_response', response)
        this.$router.push('/irs/record_point/')
      },
      update_response(response) {
        this.$store.commit('irs_record_point/update_response', response)
        this.$router.push('/irs/record_point/')
      },

      close_form() {
        // TODO: @refac Check for closing a record without saving in the router instead (and block page changes)
        if (this.response_id) {
          this.$router.push('/irs/record_point')
        } else {
          this.$refs.close_form_confirm.open()
        }
      },
      respond_to_close_form_confirm(type) {
        if (type === 'cancel') {
        } else {
          this.$router.push('/irs/record_point')
        }
      },
      team_name_changed(team_name) {
        this.$store.commit('irs_record_point/set_team_name', team_name)
      }
    }
  }
</script>

<style lang="css" scoped>
  .record-container {
    margin: 0 auto;
    max-width: 760px;
  }

  .location {
    overflow: visible;
    z-index: 2;
  }

  .record-controls { /* Not related to controls component */
    margin: 10px;
  }

  .md-card {
    margin: 10px;
  }
  .orange {
    background-color: orange !important;
    color: white !important;
  }
  .red {
    background-color: red !important;
    color: white !important;
  }
  .green {
    background-color: green !important;
    color: white !important;
  }

  .slide-fade-enter-active {
    transition: all 1s ease;
  }
  .slide-fade-leave-active {
    transition: all 1s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to{
    transform: translateY(-5px);
    opacity: 0;
  }


  /* From animate.css */
  .animated {
    animation-duration: 1s;
    animation-fill-mode: both;
  }

  @keyframes shake {
    from, to {
      transform: translate3d(0, 0, 0);
    }

    10%, 30%, 50%, 70%, 90% {
      transform: translate3d(-10px, 0, 0);
    }

    20%, 40%, 60%, 80% {
      transform: translate3d(10px, 0, 0);
    }
  }

  .shake {
    background-color: orange !important;
    animation-name: shake;
  }

</style>
