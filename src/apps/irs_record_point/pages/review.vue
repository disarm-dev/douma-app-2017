<template>
  <div>
    <h2>Review</h2>
    <p>Validation count: {{validations.errors.length}} errors, {{validations.warnings.length}} warnings</p>

    <div v-if="validations.errors.length > 0">
      <p>Errors</p>
      <ul>
        <li class="error" v-for="{message, name, relevant_questions} in validations.errors" :key="name">{{message}}</li>
      </ul>
    </div>

    <div v-if="validations.warnings.length > 0">
      <p>Warnings</p>
      <ul>
        <li class="warning" v-for="{message, name, relevant_questions, page_number} in validations.warnings" :key="name">
          {{message}}
          <md-button v-if="page_number" @click.native="goto_question(page_number)">Go to page {{page_number + 1}}</md-button>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
  export default {
    props: ['validations'],
    name: 'Review',
    methods: {
      goto_question(page_number) {
        this.$emit('goto_question', page_number)
      }
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
