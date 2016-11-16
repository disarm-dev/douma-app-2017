export function createStructuresCollection (input) {
  return input.map(i => {
    return Object.assign({
      actioned: false,
      actionBy: 'Person A',
      actionDate: new Date().toISOString().substring(0, 10),
      actionTime: new Date().getHours() + ':' + new Date().getMinutes(),
    }, i)
  }) 
}