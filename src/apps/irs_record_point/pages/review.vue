<template>
  <div v-if='is_valid'>
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

    <!-- <p class="all_clear" v-if="errors.length === 0 && warnings.length === 0">Passed all validations!</p> -->

<!--     <md-button class='md-raised' :class='{"md-warn": !is_valid}' @click.native='submit'>
      {{is_valid ? "finish & save" : "edit"}}
    </md-button>
 -->
  </div>
</template>

<script>
  // import Validators from '@/lib/validations'

  export default {
    props: ['errors', 'warnings'],
    name: 'Review',
    // watch: {
    //   'response.form_data': 'validate_location_and_form'
    // },
    computed: {
      is_valid() {
        return this.errors.length === 0 && this.warnings.length === 0
      },
      // slug() {
      //   return this.$store.state.instance_config.slug.toLowerCase()
      // }
    },
    // created(){
    //   this.validate_location_and_form()
    // },
    methods: {
      // validate_location_and_form() {
      //   // Check against all custom validations, display results
      //   let validation_results = Validators[this.slug](this.response)

      //   this.errors = validation_results.filter(validation => validation.stopping_power === 'hard')
      //   this.warnings = validation_results.filter(validation => validation.stopping_power === 'soft')
      // },

      // submit() {
      //   let result = 'fail'
      //   if (this.is_valid) {
      //     result = 'pass'
      //   }
      //   this.$emit('validation_result', result)
      // },
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
