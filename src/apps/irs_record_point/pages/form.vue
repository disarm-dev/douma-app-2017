<!-- Vue component -->
<template>
  <div>
    <multiselect v-model="value" :options="options"></multiselect>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'

  // register globally
//  Vue.component(Multiselect)

  export default {
    // OR register locally
    components: { Multiselect },
    data () {
      return {
        value: null,
        options: ['list', 'of', 'options']
      }
    }
  }
</script>



<!--<template>-->
  <!--&lt;!&ndash;<survey :survey="survey"></survey>&ndash;&gt;-->
  <!--<multiselect v-model='model' :options='choices'></multiselect>-->
<!--</template>-->

<!--<script>-->
  <!--import Vue from 'vue'-->
  <!--import * as Survey from 'survey-vue'-->
  <!--import Multiselect from 'vue-multiselect'-->

  <!--export default {-->
    <!--name: 'form',-->
    <!--components: {Multiselect},-->
    <!--props: ['existing_form_data'],-->
    <!--data () {-->
      <!--return {-->
        <!--survey: {},-->
        <!--model: null,-->
        <!--choices: ['a', 'b'],-->

      <!--}-->
    <!--},-->
    <!--computed: {-->
      <!--form() {-->
        <!--return this.$store.state.instance_config.form-->
      <!--}-->
    <!--},-->
    <!--watch: {-->
<!--//      'form': 'create_form',-->
    <!--},-->
    <!--mounted() {-->
      <!--this.register_select_widget()-->
      <!--this.create_form()-->
    <!--},-->
    <!--methods: {-->
      <!--create_form() {-->
        <!--this.survey = new Survey.Model(this.form)-->

        <!--if (this.existing_form_data) {-->
          <!--this.survey.data = this.existing_form_data-->
        <!--}-->

      <!--},-->
      <!--update_form_response() {-->
        <!--this.$emit('change', this.survey.data)-->
      <!--},-->
      <!--register_select_widget() {-->
        <!--Survey.JsonObject.metaData.addProperty("dropdown", {name: "renderAs", default: "standard", choices: ["standard", "multiselect"]});-->

        <!--var widget = {-->
            <!--name: "multiselect",-->
            <!--isFit : function(question) { return question["renderAs"] === 'multiselect'; }-->
        <!--}-->

        <!--Vue.component(widget.name, {-->
          <!--props: ['question', 'css', 'isEditMode'],-->
          <!--component: {Multiselect},-->
          <!--template: "<multiselect v-model='question.value' :options='convert(question.choices)' @select='select'></multiselect>",-->
<!--//          template: "<multiselect :options='choices'></multiselect>",-->
          <!--data() {-->
            <!--return {-->
              <!--choices: ['a', 'b'],-->
            <!--}-->
          <!--},-->
          <!--mounted() {-->
            <!--debugger-->
            <!--console.log('mounted', this)-->
          <!--},-->
          <!--methods: {-->
            <!--convert(choices) {-->
              <!--const converted = choices.map(choice => {-->
                <!--return {-->
                  <!--name: choice.text-->
                <!--}-->
              <!--})-->
              <!--console.log('converted', choices, converted)-->
              <!--return converted-->
            <!--},-->
            <!--select(a, b) {-->
              <!--console.log(a,b)-->
            <!--}-->
          <!--}-->
        <!--})-->
        <!--Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style lang="css" scoped>-->
  <!--.container {-->
    <!--margin: 10px;-->
  <!--}-->
<!--</style>-->
