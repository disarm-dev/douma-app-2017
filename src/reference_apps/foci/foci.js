import {StructuresCollection, FociCollection} from '../../lib/models.js'

// TODO: @debug Remove bootstrapped data for dev
import fociExamples from '../../data_bootstrap/foci.json'
import firebaseStructures from '../../data_bootstrap/structures.json'

// TODO: @refac Redo this to be same as IRS approach (e.g. as index.js)
export default function (state) {
    const defaultState = {
      mapBounds: {}, // TODO: @feature Check if mapBounds needed here
      focis: new FociCollection(fociExamples),
      activeFoci: null,
      structures: new StructuresCollection(firebaseStructures),
    }
    state.foci = defaultState
}