<template>
  <div class='container'>

    <md-button class='md-raised' @click.native="$router.push('/irs/record_point/list')">List</md-button>

    <h1>{{page_title}} record <md-chip>Unsaved data</md-chip></h1>

    <md-card>
      <md-card-content>
        <review 
          @goto_question="goto_question"
          :validations='validation_result'
        ></review>
      </md-card-content>
    </md-card>

    <md-card>
      <md-card-content>
        <location_record
          @change='on_location_change'
          :initial_location='initial_response.location'
        ></location_record>
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

  export default {

    name: 'Record',
    components: {location_record, form_renderer, review},
    props: ['response_id'],
    data () {
      return {
        response: {
          location: {},
          form_data: {}
        },
        // Validation result will return object looking like this:
        validation_result: {
          errors: [],
          warnings: []
        }
      }
    },
    computed: {
      slug() {
        return this.$store.state.instance_config.slug.toLowerCase()
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
      }
    },
    mounted() {
      // We need to run validations when we start, 
      // otherwise it only happens after a question has been answered. 
      this.validate()
    },
    methods: {
      goto_question(page_number) {
        this.$refs.form._survey.currentPageNo = page_number
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
          instance_slug: this.slug
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
    width: 90%;
  }

  .md-card {
    margin: 10px;
  }
</style>
