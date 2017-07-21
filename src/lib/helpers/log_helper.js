/**
 * Return a function that converts values to log-values
 * @param values_array
 * @returns {function}
 */
export const value_log = (values_array) => {
  // Source: internet, undated

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

/**
 * Return a function that converts log-values to values
 * @param values_array
 * @returns {function}
 */
export const log_value = (values_array) => {

  const non_zeros = values_array.filter(v => v !== 0)

  const mino = Math.min(...non_zeros)
  const maxo = Math.max(...values_array) * 1.001

  return (value) => {

    const minp = 0
    const maxp = 100

    const minv = Math.log(mino)
    const maxv = Math.log(maxo)

    const scale = (maxv - minv) / (maxp - minp)
    return (Math.log(value) - minv) / scale + minp;
  }
}
