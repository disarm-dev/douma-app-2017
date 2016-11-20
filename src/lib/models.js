export default class StructuresCollection  {
  constructor (models) {
    this._models = this._createModels(models)
    this._featureCollection = this._toFeatureCollection()
  }

  _createModels (models) {
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

  findModelById(modelId){
    return this._models.find( (i) => i.id === modelId )
  }

  _toFeatureCollection () {
    const models = this._models

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
}