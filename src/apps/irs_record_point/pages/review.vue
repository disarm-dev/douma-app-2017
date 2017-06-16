\<template>
  <div>
    <!--<h4>Result of validation</h4>-->
    <!--<p>Validation count: {{validations.errors.length}} errors, {{validations.warnings.length}} warnings</p>-->
    <div v-if="validations.errors.length > 0">
      <md-icon class="error">error</md-icon>
      <span>{{validations.errors.length}} Errors</span>
      <md-list>
        <md-list-item v-for="{message, name, questions} in validations.errors" :key="name">
          <span>{{message}}</span>
          <md-list-expand>
            <md-list>
              <md-list-item v-for="question_name in questions" :key="question_name">
                <a @click="go_to_page_for(question_name)">
                  {{question_name}}
                  <span>{{current_value_for(question_name)}}</span>
                </a>
              </md-list-item>
            </md-list>
          </md-list-expand>
        </md-list-item>
      </md-list>
    </div>

    <div v-if="validations.warnings.length > 0">
      <md-icon class="warning">warning</md-icon>
      <span>{{validations.warnings.length}} Errors</span>
      <md-list>
        <md-list-item v-for="{message, name, questions} in validations.warnings" :key="name">
          <span>{{message}}</span>
          <md-list-expand>
            <md-list>
              <md-list-item @click.native="go_to_page_for(question_name)" v-for="question_name in questions" :key="question_name">
                <span>{{question_name}}</span>
                <span>{{current_value_for(question_name)}}</span>
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
    props: ['validations', 'survey'],
    name: 'Review',
    methods: {
      go_to_page_for(question_name) {
        if(!question_name) return
        const question = this.survey.getQuestionByName(question_name)
        const page = this.survey.getPageByQuestion(question)
        this.survey.currentPage = page
      },
      current_value_for(question_name) {
        if(!question_name) return
        return this.survey.data[question_name]
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
