export default class StructuresCollection  {
  constructor(models) {
    this._models = this._buildCollection(models)
  }

  _buildCollection (models) {
    return models.map(i => {

      // Add default params to model
      return Object.assign({
        actioned: false,
        actionBy: 'Person A',
        actionDate: new Date().toISOString().substring(0, 10),
        actionTime: new Date().getHours() + ':' + new Date().getMinutes(),
      }, i)
    }) 
  }

  findModelById(modelId){
    return this._models.find( (i) => i.id === modelId )
  }
}