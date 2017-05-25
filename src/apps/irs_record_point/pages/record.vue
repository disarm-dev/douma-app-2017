<template>
  <div class='container'>

    <md-button class='md-raised' @click.native="$router.push('/irs/record_point/list')">List</md-button>
    <!-- <md-button class='md-raised' @click.native='clear_form'>Clear form</md-button> -->
    
    <!-- FORM -->
    <div v-if="!form_is_filled_out">
      
      <h1>{{create_or_update}} record for {{country}} <md-chip>Unsaved data</md-chip></h1>

      <md-card>
        <md-card-content>
          <location_record v-on:position='update_location' :existing_location='record.location'>
          </location_record>
        </md-card-content>
      </md-card>
    
      <md-card>
        <md-card-content>
          <form_renderer v-on:complete='complete_form' :existing_form_data='record.form_data' >
          </form_renderer>
        </md-card-content>
      </md-card>
    </div>

    <!-- REVIEW / VALIDATION -->
    <div v-else>
      <review v-on:validation_result='next_step' :record='record'></review>
    </div>

  </div>
</template>

<script>
  import uuid from 'uuid/v4'

  import location_record from '@/components/location.vue'
  import review from './review.vue'
  import form_renderer from './form.vue'

  export default {

    name: 'record',
    components: {location_record, form_renderer, review},
    props: ['record_id'],
    data () {
      return {
        form_is_filled_out: false,
        record: {
          location: null,
          form_data: null
        },
        // don't need below
        form_completed: false,
        location_completed: false,
        record_completed: false
      }
    },
    computed: {
      country() {
        return this.$store.state.instance_config.name
      },
      slug() {
        return this.$store.state.instance_config.slug.toLowerCase()
      },
      create_or_update() {
        return this.record_id ? 'Update' : 'Create'
      },
    },
    created() {
      if (this.record_id) {
        const found = this.$store.state.irs_record_point.records.find(r => r.id === this.record_id)
        if (found) this.record = found
      }
    },
    methods: {
      clear_form() {
        console.info("TODO: @feature Implement clear_form")
      },
      complete_form(form_data) {
        this.record.form_data = form_data
        this.form_is_filled_out = true
      },

      update_location(location) {
        if (location.hasOwnProperty('coords') && location.coords.hasOwnProperty('accuracy')) {
          this.record.location = location
        } else {
          console.log('location error')
        }
      },

      next_step(validation_result) {
        if (validation_result === 'pass') {
          this.save_record()
        } else {
          this.form_is_filled_out = false
        }
      },

      save_record() {

        // TODO: @refac Move to a proper record model, with tests. And cake.
        const id = this.record_id || uuid()
        const recorded_on = this.record.recorded_on || new Date()

        const record = {
          form_data: this.record.form_data,
          location: this.record.location,
          recorded_on: recorded_on,
          id: id,
          synced: false,
          userAgent: navigator.userAgent,
          instance_slug: this.slug
        }

        if (this.record_id) {
          this.update_record(record)
        } else {
          this.create_record(record)
        }
      },

      create_record(record) {
        this.$store.commit('irs_record_point/create_record', record)
        this.$router.push('/irs/record_point/')
      },
      update_record(record) {
        this.$store.commit('irs_record_point/update_record', record)
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
