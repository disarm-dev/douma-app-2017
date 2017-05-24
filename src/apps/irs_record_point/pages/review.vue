<template>
  <div>
    <h2>Review</h2>
      <div v-if="errors.length > 0">
      <p>Errors</p>
      <ul>
        <li class="error" v-for="{message, name, input_questions} in errors" :key="name">{{message}}</li>
      </ul>
    </div>

    <div v-if="warnings.length > 0">
      <p>Warnings</p>
      <ul>
        <li class="warning" v-for="{message, name, input_questions} in warnings" :key="name">{{message}}</li>
      </ul>
    </div>

    <p class="all_clear" v-if="errors.length === 0 && warnings.length === 0">Passed all validations!</p>

    <md-button class='md-raised' :class='{"md-warn": !is_valid}' @click.native='submit'>
      {{is_valid ? "finish" : "edit"}}
    </md-button>

  </div>
</template>

<script>
  import Validators from '@/lib/validations'

  export default {
    props: ['response'],
    name: 'Review',
    data () {
      return {
        errors: [],
        warnings: [],
      }
    },
    computed: {
      is_valid() {
        return this.errors.length === 0 && this.warnings.length === 0
      }
    },
    mounted(){
      // this.validate_location_and_form()
    },
    methods: {
      validate_location_and_form() {

        // Check location is set (and warn if accuracy is not acceptable)
        // if (this.location) {
        //   this.errors.push({
        //     name: 'missing_location',
        //     message: 'Missing location',
        //     stopping_power: "hard"
        //   })
        // } else {
        //   this.message = 'No location'
        // }

        // Check against all custom validations, display results
        let validations = Validators[this.slug](data)

        this.errors = validations.filter(validation => validation.stopping_power === 'hard')
        this.warnings = validations.filter(validation => validation.stopping_power === 'soft')
      },

      submit() {
        let result = 'fail'
        if (this.is_valid) {
          result = 'pass'
        }
        this.$emit('validation_result', result)
      },
    }
  }
</script>

<style lang="css" scoped>
  .error {
    color: red;
  }

  .warning {
    color: orange;
  }

  .all_clear {
    color: green;
  }
</style>