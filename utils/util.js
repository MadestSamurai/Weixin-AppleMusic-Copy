//util.js
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function zeroFill(str, n){
  //补零方法，str为数字字符串 n为需要的位数，不够补零
  if (str.length < n){
   str = '0'+str
  }
  return str
 }

module.exports = {
  zeroFill: zeroFill,
}