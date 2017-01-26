export default function (state) {
    const appState = {
      actions:[],
      mapReRenderCount: 0,
      structures: [], // StructuresCollection
      activeStructure: '', // StructureModel from StructuresCollection
      activeLayer: null
    }
    state.irs = appState
    if (DOUMA_DEV_MODE) console.log('mounted IRS with', appState) // TODO: @debug remove debug statement
}