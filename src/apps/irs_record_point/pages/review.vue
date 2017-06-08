<template>
  <div>
    <!--<h4>Result of validation</h4>-->
    <!--<p>Validation count: {{validations.errors.length}} errors, {{validations.warnings.length}} warnings</p>-->

    <div v-if="validations.errors.length > 0">
      <md-list>
        <md-list-item class="error">
          <md-icon  class="error">error</md-icon>
          <span class="error">{{validations.errors.length}} Errors</span>
          <md-list-expand>
            <md-list>
              <md-list-item v-for="{message, name, relevant_questions} in validations.errors" :key="name">
                <span>{{message}}</span>
              </md-list-item>
            </md-list>
          </md-list-expand>
        </md-list-item>
      </md-list>
    </div>

    <div v-if="validations.warnings.length > 0">
      <md-list>
        <md-list-item class="warning">
          <md-icon  class="warning">warning</md-icon>
          <span>{{validations.warnings.length}} Errors</span>
          <md-list-expand>
            <md-list>
              <md-list-item v-for="{message, name, relevant_questions} in validations.warnings" :key="name">
                <span>{{message}}</span>
              </md-list-item>
            </md-list>
          </md-list-expand>
        </md-list-item>
      </md-list>

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
