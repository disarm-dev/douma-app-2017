<template>
  <div class="applet_container">
    <md-card class="card">
      <md-card-header>
        <div class="md-title">Create form</div>
      </md-card-header>
      <md-card-content v-if="!got_form">
        <p>Please go to <a href="https://dxsurvey.com/" target="_blank">Dxsurvey.com</a> and create a form. Then paste the link in below when you are done.</p>

        <md-input-container>
          <label>Dxsurvey.com url</label>
          <md-input v-model="dx_url"></md-input>
        </md-input-container>
      </md-card-content>
      <md-card-content v-else>
        Downloaded form
      </md-card-content>
      <md-card-actions>
        <md-button @click.native="use_default">Use default form</md-button>
        <md-button @click.native="get_form">Get form</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
export default {
  name: 'create_form',
  data () {
    return {
      dx_url: '',
      got_form: false
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
          this.got_form = true
        })
    },
    use_default() {
      this.dx_url = 'https://dxsurvey.com/published?id=df1d04a8-6950-490d-bc4c-32e9a98f2ee1'
    }
  }
};
</script>

<style lang="css" scoped>
  .card {
    margin: 1em auto;
  }
</style>
