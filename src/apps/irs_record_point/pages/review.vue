<template>
  <div>
    <h2>Form validation</h2>
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
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
  export default {
    props: ['validations'],
    name: 'Review',
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
