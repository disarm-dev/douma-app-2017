<template>
  <div class='container'>
    <h1>Structure record</h1>
    <p>Use the buttons below to record the spray status of this structure.</p>
    <i><md-icon>add_to_queue</md-icon>Future versions can have more fields, custom-fields, etc.</i>
    
    <vue-form-generator :schema="schema" :model="model" :options="formOptions"></vue-form-generator>
    
    <!-- <form>
      <p><md-radio v-model="task.properties.status" name="status" md-value="unvisited">Unvisited</md-radio></p>
      <p><md-radio v-model="task.properties.status" name="status" md-value="visited_successful">Visited and sprayed</md-radio></p>
      <p>
        <md-radio v-model="task.properties.status" name="status" md-value="visited_unsuccessful">Visited and not sprayed</md-radio>
        <input type="" name="" placeholder="because">
      </p>
      <p>
        <md-radio v-model="task.properties.status" name="status" md-value="visited_unsprayable">Visited, structure is unsprayable</md-radio>
        <input type="" name="" placeholder="because">
      </p>

      <label>Another field</label>
      <input type="" name="">
      <br/>
      <label>A second other field</label>
      <input type="" name="">
      <br/>

      <md-button class='md-primary md-raised' @click.native='save'><md-icon>save</md-icon><span>Save</span></md-button>
      <md-button @click.native='cancel'><md-icon>cancel</md-icon><span>Cancel</span></md-button>
    </form> -->

  </div>
</template>


<script>
  import Vue from 'vue';
  import VueFormGenerator from "vue-form-generator";

  Vue.use(VueFormGenerator);

  export default {
    name: 'TaskEdit',
    props: ['cluster_id', 'task_id', 'task'],
    methods: {
      save() {
        // dispatch update action
        this.task.user_id = this.$store.state.meta.user.id
        this.$store.dispatch("irs_record:update_task", this.task).then(() => {
          // navigate back
          this.$router.push({name: 'irs_record:tasks', params: {cluster_id: this.cluster_id}})
        })
      },
      cancel() {
        this.$router.go(-1)
      }
    },
    data() {
      return {
  
    model: {             
      id: 1,
      name: "John Doe",
      password: "J0hnD03!x4",
      skills: ["Javascript", "VueJS"],
      email: "john.doe@gmail.com",
      status: true
    },
  
    schema: {
      fields: [{
        type: "input",
        inputType: "text",
        label: "ID (disabled text field)",
        model: "id",
        readonly: true,         
        disabled: true
      },{
        type: "input",
        inputType: "text",
        label: "Name",
        model: "name",
        placeholder: "Your name",
        featured: true,
        required: true
      },{
        type: "input",
        inputType: "password",
        label: "Password",
        model: "password",
        min: 6,
        required: true,
        hint: "Minimum 6 characters",
        validator: VueFormGenerator.validators.string
      },{
        type: "select",
        label: "Skills",
        model: "skills",      
        values: ["Javascript", "VueJS", "CSS3", "HTML5"]
      },{
        type: "input",
        inputType: "email",
        label: "E-mail",
        model: "email",
        placeholder: "User's e-mail address"
      },{
        type: "checkbox",
        label: "Status",
        model: "status",
        default: true
      }]
    },

    formOptions: {
      validateAfterLoad: true,
      validateAfterChanged: true
    }
  }
    }
  }
</script>


<style scoped>
  .container { margin: 10px; }
</style>