<template>
  <div class="applet_container">
    <md-card class="card">
      <md-card-header>
        <div class="md-title">Create form</div>
      </md-card-header>
      <md-card-content>
        <p>Please go to <a href="https://dxsurvey.com/" target="_blank">Dxsurvey.com</a> and create a form. Then paste the link in below when you are done.</p>

        <md-input-container>
          <label>Dxsurvey.com url</label>
          <md-input v-model="dx_url"></md-input>
        </md-input-container>
      </md-card-content>
      <md-card-actions>
        <md-button @click.native="get_form">Continue</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
export default {
  name: 'create_form',
  data () {
    return {
      dx_url: ''
    }
  },
  methods: {
    get_form() {
      if (!this.dx_url.length) return
      // fetch
      const url = `https://wt-jonathan-peoplesized_com-0.run.webtask.io/disarm-surveyjs-extract-form?form_url=${this.dx_url}`

      fetch(url)
        .then(res => res.json())
        .then((form) => {
          console.log(form)
          this.$store.commit('data_wizard/set_form', form)
          this.$router.push({name: 'data_wizard:validations'})
        })
    }
  }
};
</script>

<style lang="css" scoped>
  .card {
    margin: 1em auto;
  }
</style>