const cache = {
  geodata: {
    // all_target_areas: null, // FeatureCollection
    // clusters: null // FeatureCollection
  },
}
// TODO: @debug Remote this global when we no longer need our training wheels
window.__disarm_debug_cache = cache

export default cache
