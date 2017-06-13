export default (min, max) => {
  return (value) => {

    var minp = 0;
    var maxp = 100;

    // The result should be between 100 an 10000000
    var minv = Math.log(min);
    var maxv = Math.log(max);

    // calculate adjustment factor
    var scale = (maxv-minv) / (maxp-minp);

    return (Math.log(value)-minv) / scale + minp;
  }
}