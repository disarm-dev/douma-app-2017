import {StructuresCollection, FociCollection} from '../../lib/models.js'

// TODO: @debug Remove bootstrapped data for dev
import fociExamples from '../../data_bootstrap/foci.json'
import firebaseStructures from '../../data_bootstrap/structures.json'

export default function (state) {
    const defaultState = {
      mapBounds: {}, // TODO: @feature Check if mapBounds needed here
      focis: new FociCollection(fociExamples),
      activeFoci: null,
      structures: new StructuresCollection(firebaseStructures),
    }
    state.foci = defaultState
    if (DOUMA_DEV_MODE) console.log('mounted FOCI with', defaultState) // TODO: @debug remove debug statement
}