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




export class LogSlider {
  constructor(options) {
    options = options || {};
    this.minpos = options.minpos || 0;
    this.maxpos = options.maxpos || 100;
    this.minlval = Math.log(options.minval || 1);
    this.maxlval = Math.log(options.maxval || 100000);

    this.scale = (this.maxlval - this.minlval) / (this.maxpos - this.minpos);
  }

  // Calculate value from a slider position
  value(position) {
    return Math.exp((position - this.minpos) * this.scale + this.minlval);
  }

  // Calculate slider position from a value
  position(value) {
    return this.minpos + (Math.log(value) - this.minlval) / this.scale;
  }
}

