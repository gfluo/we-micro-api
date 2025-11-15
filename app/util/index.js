const videoUpload = require('./videoUpload');

const isInteger = (str) => {
  return /^-?\d+$/.test(str);
}

module.exports = {
    videoUpload,
    isInteger
}