export default ({features, property}) => {
  // Source: internet, undated

  const values_array = features.map(feature => feature.properties[property]).sort()
  const non_zeros = values_array.filter(v => v !== 0)

  const mino = Math.min(...non_zeros)
  const maxo = Math.max(...values_array) * 1.001

  return (value) => {

    const minp = 0
    const maxp = 100

    const minv = Math.log(mino)
    const maxv = Math.log(maxo)

    const scale = (maxv-minv) / (maxp-minp)

    return (Math.log(value)-minv) / scale + minp
  }
}
