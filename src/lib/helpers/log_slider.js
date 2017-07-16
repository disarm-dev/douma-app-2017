export default (minp, maxp, mino, maxo) => {
  return (position) => {
    // minp and maxp are 0 and 100 - slider values
    // mino and maxo are output values

    // The result should be between 100 an 10000000
    const minv = Math.log(mino);
    const maxv = Math.log(maxo);

    // calculate adjustment factor
    const scale = (maxv-minv) / (maxp-minp);

    return Math.exp(minv + scale*(position-minp))
  }
}
