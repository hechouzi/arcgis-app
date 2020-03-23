export default {
  /**
   * 数组对象递归匹配
   * @param {*} arr
   * @param {*} key
   */
  arrRecursive (arr, key, item, path) {
    let _this = this
    var newArray = []
    for (var i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i][key])) {
        newArray.push.apply(newArray, _this.arrRecursive(arr[i][key]))
      } else {
        if (arr[i][item] === path) {
          newArray.push(arr[i])
        }
      }
    }
    return newArray
  },
  /**
   * 解析XML获取镶嵌数据集参数
   *  @param {String} productMark：产品标识
   *  @param {xml} productXml：xml文件结构
   */
  getMosicalParam (productMark, productXml) {
    let nodeList = productXml.getElementsByTagName('Plugin')
    let inputRanges = []
    let outputValues = []
    let colorMap = []
    let labelArray = []
    let pixLabel
    // let nodata = ''
    let unit
    for (let i = 0; i <= nodeList.length - 1; i++) {
      if (nodeList[i].attributes[0].value === productMark) {
        pixLabel = nodeList[i].getElementsByTagName('ProdDesp')[0].textContent
        unit = nodeList[i].getElementsByTagName('ReMaps')[0].attributes[0].value
        // nodata = nodeList[i].getElementsByTagName('ReMaps')[0].attributes[1].value
        let reMapDom = nodeList[i].childNodes[3].getElementsByTagName('ReMap')
        for (let j = 0; j <= reMapDom.length - 1; j++) {
          let reMapAttr = reMapDom[j].attributes
          let minValue = Number(reMapAttr[1].value)
          let maxValue = Number(reMapAttr[2].value)
          let revLevel = Number(reMapAttr[3].value)
          let colorValue = reMapAttr[4].value.split(',')
          let colorArr = []
          inputRanges.push(minValue)
          inputRanges.push(maxValue)
          outputValues.push(revLevel)
          colorArr.push(revLevel)
          colorValue.forEach(item => {
            colorArr.push(Number(item))
          })
          colorMap.push(colorArr)
          labelArray.push(reMapAttr[5].value)
        }
      }
    }
    let data = {
      inputRanges: inputRanges,
      outputValues: outputValues,
      colorMap: colorMap,
      labelArray: labelArray,
      pixLabel: pixLabel,
      unit: unit
    }
    return data
  }
}
