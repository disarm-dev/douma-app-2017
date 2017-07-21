// Source: internet, undated

/**
 * Return a function that converts values to log-values
 * @param values_array
 * @returns {function}
 */
export const value_log = (values_array) => {
  const non_zeros = values_array.filter(v => v !== 0)

  const mino = Math.min(...non_zeros)
  const maxo = Math.max(...values_array) * 1.001

  const minp = 0
  const maxp = 100

  const minv = Math.log(mino)
  const maxv = Math.log(maxo)

  const scale = (maxv - minv) / (maxp - minp)

  return (value) => ((Math.log(value) - minv) / scale + minp)
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

  const minp = 0
  const maxp = 100

  const minv = Math.log(mino)
  const maxv = Math.log(maxo)

  const scale = (maxv - minv) / (maxp - minp)

  return (lvalue) => (Math.exp((lvalue - minp) * scale + minv))
}




export class LogValueConvertor {
  /**
   * @param values_array
   */
  constructor(values_array) {
    const non_zeros = values_array.filter(v => v !== 0)

    const mino = Math.min(...non_zeros)
    const maxo = Math.max(...values_array) * 1.001

    this.minp = 0
    const maxp = 100

    this.minv = Math.log(mino)
    const maxv = Math.log(maxo)

    this.scale = (maxv - this.minv) / (maxp - this.minp)
  }

  /**
   * Take a value and return a log/scaled value
   * @param value
   * @returns {log_value}
   */
  lval(value) {
    return ((Math.log(value) - this.minv) / this.scale + this.minp)
  }

  /**
   * Take a log/scaled value and return the original
   * @param lval
   * @returns {value}
   */
  value(lval) {
    return (Math.exp((lval - this.minp) * this.scale + this.minv))

  }
}
