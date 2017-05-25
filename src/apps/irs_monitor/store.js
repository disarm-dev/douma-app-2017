export default {
  namespaced: true,
  state: {
    records: [],
    filters: []
  },
  mutations: {
    create_record: (state, record) => {
      state.records.push(record)
    },
    update_record: (state, record) => {
      let index = state.records.findIndex((r) => r.id === record.id)
      state.records.splice(index, 1, record)
    },
    toggle_filter: (state, filter) => {
      let index = state.filters.findIndex(f => f.type === filter.type && f.value === filter.value)
      if (index === -1) {
        state.filters.push(filter)
      } else {
        state.filters.splice(index, 1)
      }
    },
    remove_filter: (state, type) => {
      state.filters = state.filters.filter((f) => {
        return f.type !== type
      })
    }
  }
}
