export default {
  mounted() {
    this.get_default_options_and_filters()

    this.$unity.subscribe_to_pipeline() // TODO: @unity .subscribe_to_pipeline() should either accept a function or return 'stream'
      .on(data_to_render => {
        // this function gets called every time something related to this pipeline changes
        this.data_to_render = data_to_render
      })
  }
}