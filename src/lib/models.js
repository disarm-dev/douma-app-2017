// TODO: Do this
// class StructureModel {

// }

export default class StructuresCollection  {
  constructor (models) {
    this.models = this._createModels(models)
    this.featureCollection = this.toFeatureCollection()
  }

  _createModels (models = []) {
    return models.map(i => {

      // Add default params to model
      // TODO: Check whether these are real or debugging-only
      return Object.assign({
        actioned: false,
        casePresent: Math.random() >= 0.5, // random boolean
        actionBy: 'Person A',
        actionDate: new Date().toISOString().substring(0, 10),
        actionTime: new Date().getHours() + ':' + new Date().getMinutes(),
      }, i)
    }) 
  }

  findIndex(structureCopy) {
    var index;
    this.models.findIndex((o, i) => {
      if(o.id === structureCopy.id) {
        index = i
      }
    })
    return index
  }

  toFeatureCollection () {
    const models = this.models

    let output = {
      type: "FeatureCollection",
      features: []
    }

    output.features = models.map((i, index) => {
      let obj = { type: 'Feature', properties: i, geometry: i.geometry }

      // Remove duplicate
      delete obj.properties.geometry

      return obj
    })

    // Returns a FeatureCollection
    return output 
  }

  modelsFromFeatureCollection () {
    return this.featureCollection.features.map( (i) => i.properties )
  }
  
  // Finders
  findModelById(modelId){
    return this.models.find( (i) => i.id === modelId )
  }
}