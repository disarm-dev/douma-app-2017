import chroma from 'chroma-js'

export function prepare_palette(layer_definition) {
  let scale = chroma.scale(layer_definition.palette).colors(11)
  if (layer_definition.reverse_palette) scale = scale.reverse()

  const steps = [...Array(11).keys()].map(i => i * 10)
  const stops = steps.map((step, index) => {
    return [step, scale[index]]
  })
  return stops
}