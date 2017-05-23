<template>
  <survey :survey="survey"></survey>
</template>

<script>
  import Vue from 'vue'
  import $ from 'jquery/dist/jquery.min.js'
  import * as Survey from 'survey-vue'
  import 'select2'

  export default {
    name: 'form',
    props: ['existing_form_data'],
    data () {
      return {
        survey: {},
      }
    },
    computed: {
      form() {
        return this.$store.state.instance_config.form
      }
    },
    watch: {
//      'form': 'create_form',
    },
    mounted() {
      this.register_select2_widget()
      this.create_form()
    },
    methods: {
      create_form() {
        this.survey = new Survey.Model(this.form)

        if (this.existing_form_data) {
          this.survey.data = this.existing_form_data
        }

      },
      update_form_response() {
        this.$emit('change', this.survey.data)
      },
      register_select2_widget() {
        Survey.JsonObject.metaData.addProperty("dropdown", {name: "renderAs", default: "standard", choices: ["standard", "select2"]});

        var widget = {
            name: "select2",
            isFit : function(question) { return question["renderAs"] === 'select2'; }
        }

        Vue.component(widget.name, {
            props: ['question', 'css', 'isEditMode'],
            template: "<select style='width: 100%;'></select>",
            mounted: function () {
                var vm = this;
                $(vm.$el).select2({
                    data: vm.question.choices.map(function(choice) { return { id: choice.value, text: choice.text }; }),
                    theme: "classic"
                });
                vm.question.choicesChangedCallback = function() {
                    $(vm.$el).select2({data: vm.question.visibleChoices.map(function(choice) { return { id: choice.value, text: choice.text }; })});
                }
                $(vm.$el).on('select2:select', function (e) {
                  vm.question.value = e.target.value;
                });
                var updateHandler = function() {
                    $(vm.$el).val(vm.question.value).trigger("change");
                }
                vm.question.valueChangedCallback = updateHandler;
                updateHandler();
            },
            destroyed: function () {
                $(this.$el).select2("destroy");
            }
        })
        Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
      }
    }
  }
</script>

<style lang="css" scoped>
  .container {
    margin: 10px;
  }
</style>
