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
                <a @click="go_to_page_for(question_name)">{{question_name}}</a>
                <span>Current value: {{current_value_for(question_name)}}</span>
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
              <md-list-item v-for="question_name in questions" :key="question_name">
                <a @click="go_to_page_for(question_name)">{{question_for_question_name(question_name)}}</a>
                <span>Current value: {{current_value_for(question_name)}}</span>
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
    computed: {
      where_stuff_is_broken_and_what_the_current_value_is() {
        console.log(this.validations, this.survey)

      }
    },
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
      },
      question_for_question_name(question_name) {
        return this.survey.getQuestionByName(question_name).title
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
