// TODO: Do this
// class StructureModel {

// }

export class BaseCollection {

  defaults = {}

  constructor (object, defaults) {
    this.defaults = defaults
    const array = this.firebaseObjectToArray(object)
    this.models = this._createModels(array)
    this.featureCollection = this.toFeatureCollection()
  }

  firebaseObjectToArray (data) {
    // data is an "object of objects"
    // MUST HAVE an INTEGER as the key
    let output = []
    for (const key in data) {
      // skip loop if the property is from prototype
      if (!data.hasOwnProperty(key)) continue
      output.push({...data[key], id: parseInt(key)})
    }
    return output
  }


  _createModels (models = []) {
    return models.map((m, i) => {
      // Add default params to model
      // TODO: Check whether these are real or debugging-only
      return Object.assign({}, this.defaults, m)
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

    output.features = models.map((i) => {
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

  getModel(id) {
    return this.models.find(o => o.id === id)
  }

  getFeature(id) {
    return this.featureCollection.features.find(o => o.id === id)
  }
  
  // Finders
  findModelById(modelId){
    return this.models.find( (i) => i.id === modelId )
  }
}

export class StructuresCollection extends BaseCollection {

  constructor(models) {
    super(models, {
      actioned: false,
      casePresent: (() => {Math.random() >= 0.5})(), // TODO: fix, doesn't work
      actionBy: 'Person A',
      actionDate: new Date().toISOString().substring(0, 10),
      actionTime: new Date().getHours() + ':' + new Date().getMinutes(),
    })
  }
}

export class FociCollection extends BaseCollection {
  constructor(models) {
    super(models)
  }
}
