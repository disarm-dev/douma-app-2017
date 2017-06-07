<template>
  <div class='container'>

    <div class="chip-holder">
      <md-chip :class="{green: validation_result_empty, orange: !validation_result_empty}" @click.native="toggle_show_validation_result">
        {{ validation_result_empty ? "Valid record" : "Validation issues"}}
      </md-chip>

      <md-chip :class="{green: location_is_valid, orange: !location_is_valid}" @click.native="toggle_show_location">
        {{ location_is_valid ? "Location" : "Set location"}}
      </md-chip>
    </div>

    <md-card v-show="show_validation_result">
      <md-card-content>
        <review
          ref="validation_result"
          :validations='validation_result'
        ></review>
      </md-card-content>
    </md-card>

    <md-card class='location' v-show="show_location">
      <md-card-content>
        <location_record
          @change='on_location_change'
          :initial_location='initial_response.location'
        ></location_record>
        <multiselect
          v-model="response.location_selection"
          :options="location_options"
          group-values="locations"
          group-label="category"
          placeholder="Search location"
          track-by="id"
          label="name">
          <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>
        </multiselect>
      </md-card-content>
    </md-card>

    <md-card>
      <md-card-content>
        <form_renderer
          ref="form"
          @complete='on_form_complete'
          @change="on_form_change"
          :initial_form_data='initial_response.form_data'
          :response_is_valid="response_is_valid"
        ></form_renderer>
      </md-card-content>
    </md-card>

  </div>
</template>

<script>
  import uuid from 'uuid/v4'

  import location_record from '@/components/location.vue'
  import review from './review.vue'
  import form_renderer from './form.vue'
  import Validators from '@/lib/validations'
  import array_unique from 'array-unique'

  import Multiselect from 'vue-multiselect'
  import 'vue-multiselect/dist/vue-multiselect.min.css'

  export default {

    name: 'Record',
    components: {location_record, form_renderer, review, Multiselect},
    props: ['response_id'],
    data () {
      return {
        response: {
          location_selection: {},
          location: {},
          form_data: {}
        },
        // Validation result will return object looking like this:
        validation_result: {
          errors: [],
          warnings: []
        },
        show_validation_result: false,
        show_location: false
      }
    },
    computed: {
      location_options() {
        const raw = this.$store.state.instance_config.location

        const categories = array_unique(raw.map(r => r.category)).sort()

        const nested = categories.map(category => {
          const matches = raw
            .filter(r => r.category === category)
            .map(r => {
              return {
                name: r.name,
                id: r.id
              }
            })
          return {
            category,
            locations: matches
          }
        })

        return nested
      },
      user_name() {
        return this.$store.state.meta.user.name
      },
      slug() {
        return this.$store.state.instance_config.slug
      },
      page_title() {
        return this.response_id ? 'Update' : 'Create'
      },
      initial_response() {
        if (this.response_id) {
          return this.$store.state.irs_record_point.responses.find(r => r.id === this.response_id)
        } else {
          return {
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
        return this.validation_result.errors.filter(e => e.name === 'no_location').length === 0
      }
    },
    mounted() {
      // We need to run validations when we start,
      // otherwise it only happens after a question has been answered.
      this.validate()

      // Display validations on initial validate only
      this.show_validation_result = !this.validation_result_empty
      this.show_location = !this.location_is_valid

    },
    methods: {
      toggle_show_validation_result() {
        this.show_validation_result = !this.show_validation_result
      },
      toggle_show_location() {
        this.show_location = !this.show_location
      },
      // TODO: @feature Implement clear_form"
      on_location_change(location) {
        this.response.location = location
        this.validate()
      },
      on_form_change(form_data) {
        this.response.form_data = form_data
        this.validate()
      },
      on_form_complete(form_data) {
        this.on_form_change(form_data)

        if (this.response_is_valid) {
          this.save_response()
        } else {
          console.log('No idea what we do here.')
        }
      },
      validate() {
        this.validation_result = Validators[this.slug](this.response, this.$store.state.instance_config.form)
        if (this.validation_result_empty) this.show_validation_result = false
        if (this.location_is_valid) this.show_location = false
      },
      save_response() {
        // TODO: @refac Move to a proper response model, with tests. And cake.
        const id = this.response_id || uuid()
        const recorded_on = this.response.recorded_on || new Date()

        const response = {
          form_data: this.response.form_data,
          location: this.response.location,
          recorded_on: recorded_on,
          id: id,
          synced: false,
          userAgent: navigator.userAgent,
          country: this.slug,
          user: this.user_name
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
  .container {
    margin: 0 auto;
    max-width: 760px;
  }

  .location {
    height: 300px;
  }

  .chip-holder {
    margin: 10px;
  }

  .md-card {
    margin: 10px;
  }
  .orange {
    background-color: orange !important;
    color: white;
  }
  .green {
    background-color: green !important;
    color: white;
  }

</style>
