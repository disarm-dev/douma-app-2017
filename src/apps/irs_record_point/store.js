export default {
  namespaced: true,
  state: {
    records: []
  },
  mutations: {
    create_record: (state, record) => {
      state.records.push(record)
    },
    update_record: (state, record) => {
      let index = state.records.findIndex((r) => r.id === record.id)
      state.records.splice(index, 1, record)
    },
    delete_record: (state, record) => {
      let index = state.records.findIndex((r) => r.id === record.id)
      state.records.splice(index, 1)
    },
    delete_all_records: (state) => {
      state.records = []
    }
  }
}
