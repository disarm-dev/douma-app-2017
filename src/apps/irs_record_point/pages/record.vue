<template>
  <div class='record-container'>

    <div class="chip-holder">

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


      <!--BACK TO LIST-->
      <md-button
        v-if="response_id"
        @click.native="$router.push('/irs/record_point')"
      >
        Back to list
      </md-button>
    </div>


    <!--VALIDATION CARD-->
    <transition name="slide-fade">
      <md-card v-show="show_validation_result">
        <review
          ref="validation_result"
          :validations='validation_result'
          :survey="survey"
          v-on:show_location="set_current_view('location')"
        ></review>
        <md-card-actions>
          <md-button @click.native="show_validation_result = false">Hide</md-button>
        </md-card-actions>
      </md-card>
    </transition>


    <!-- METADATA EDITOR-->
    <md-card v-show="current_view === 'metadata'">
      <md-card-content>
        <md-card-header>
          <div class="md-title">Metadata</div>
        </md-card-header>
        <md-list>
          <md-list-item>username: {{username}}</md-list-item>
          <!--<md-list-item>recorded_on: {{recorded_on}}</md-list-item>-->
          <!--<md-input-container>-->
            <!--<label>Team</label>-->
            <!--<md-input v-model="team"></md-input>-->
          <!--</md-input-container>-->
        </md-list>

      </md-card-content>
      <md-card-actions>
        <md-button @click.native="set_current_view('location')" class="md-raised">Next</md-button>
      </md-card-actions>
    </md-card>

    <!--LOCATION CARD-->
    <md-card v-show="current_view === 'location'" class='location'>
      <md-card-content>
        <md-card-header>
          <div class="md-title">Location</div>
        </md-card-header>

        <location_record
          @change='on_location_change'
          :initial_location='initial_response.location'
        ></location_record>

      <location_selection
        @change="on_location_selection_selected"
        :initial_location_selection="initial_response.location_selection"
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
      @change="on_form_change"
      @previous_view="set_current_view('location')"
      :initial_form_data='initial_response.form_data'
      :response_is_valid="response_is_valid"
    ></form_renderer>

  </div>
</template>

<script>
  import location_record from 'components/location.vue'
  import location_selection from './location_selection'
  import review from './validation.vue'
  import form_renderer from './form.vue'
  import {Validator} from 'lib_instances/validations'
  import {Response} from 'lib/models/response.model'

  export default {
    name: 'Record',
    components: {location_record, form_renderer, review, location_selection},
    props: ['response_id'],
    data () {
      return {
        _validator: null,

        response: {
          location_selection: {},
          location: {},
          form_data: {}
        },

        survey: null,

        // Validation result will return object looking like this:
        validation_result: {
          errors: [],
          warnings: []
        },
        show_validation_result: false,
        show_location: false,

        shake_button: false,

        pages: ['metadata', 'location', 'form'],
        current_view: 'metadata'
      }
    },
    watch: {
      'validation_length': 'shake_validations'
    },
    computed: {
      username() {
        return this.$store.state.meta.user.name
      },
      instance_config() {
        return this.$store.state.instance_config
      },
      page_title() {
        return this.response_id ? 'Update' : 'Create'
      },
      initial_response() {
        if (this.response_id) {
          return this.$store.state.irs_record_point.responses.find(r => r.id === this.response_id)
        } else {
          return {
            location_selection: {},
            location: {},
            form_data: {}
          }
        }
      },
      response_is_valid() {
        return (this.validation_result.errors.length === 0)
      },
      validation_result_empty() {
        return (this.validation_result.errors.length === 0) && (this.validation_result.warnings.length === 0)
      },
      location_is_valid() {
        return this.validation_result.errors.filter(e => e.is_location).length === 0
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
      this._validator = new Validator(this.instance_config)
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
      toggle_show_location() {
        this.show_location = !this.show_location
      },
      on_location_change(location) {
        this.response.location = location
        this.validate(this.response)
      },
      on_location_selection_selected(location_selection){
        this.response.location_selection = location_selection
        this.validate(this.response)
      },
      on_form_change(survey) {
        this.response.form_data = survey.data
        this.survey = survey
        this.validate(this.response)
      },
      on_form_complete(survey) {
        this.on_form_change(survey)

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
        // TODO: @refac Move to a proper response model, with tests. And cake.
        let response

        try {
          response = new Response().create({
            ...this.response,
            id: this.response_id,
            recorded_on: this.response.recorded_on,
            country: this.instance_config.instance.slug,
            user: this.username
          })
        } catch (e) {
          return console.log(e)
        }

        if (this.response_id) {
          this.update_response(response)
        } else {
          this.create_response(response)
        }
      },
      create_response(response) {
        this.$store.commit('irs_record_point/create_response', response)
        this.$router.push('/irs/record_point/')
      },
      update_response(response) {
        this.$store.commit('irs_record_point/update_response', response)
        this.$router.push('/irs/record_point/')
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

  .chip-holder {
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
