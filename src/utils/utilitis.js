export default {
  // 小数转换百分比并且保留小数点后两位
  PercentNum(num) {
    let Nnum = Number(num * 100).toFixed(2)
    Nnum += '%'
    return Nnum
  },

  /**
   * 获取元素样式兼容性写法
   * @param obj // dom对象
   * @param style // 获取的样式
   * @return {*}
   */
  getStyle(obj, style) {
    return obj.currentStyle ? obj.currentStyle[style] : getComputedStyle(obj, false)[style]
  },

  /**
   * 判断两个对象是否相等
   * @param object1
   * @param object2
   * @return {boolean}
   */
  ObjectEquals(object1, object2) {
    for (let propName in object1) {
      if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
        return false
      } else if (typeof object1[propName] !== typeof object2[propName]) {
        return false
      }
    }
    for (let propName in object2) {
      if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
        return false
      } else if (typeof object1[propName] !== typeof object2[propName]) {
        return false
      }
      if (!object1.hasOwnProperty(propName)) continue

      if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
        if (!ObjectEquals(object1[propName], object2[propName])) return false
      } else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
        if (!ObjectEquals(object1[propName], object2[propName])) return false
      } else if (object1[propName] !== object2[propName]) {
        return false
      }
    }
    return true
  },

  /**
   * 判断数组是否相同
   * @param arry1
   * @param arry2
   * @return {boolean}
   */
  ArrayEquals(arry1, arry2) {
    if (!arry2) {
      return false
    }
    if (arry1.length !== arry2.length) {
      return false
    }
    for (var i = 0, l = arry1.length; i < l; i++) {
      if (arry1[i] instanceof Array && arry2[i] instanceof Array) {
        if (!arry1[i].ArrayEquals(arry2[i])) return false
      } else if (arry1[i] !== arry2[i]) {
        return false
      }
    }
    return true
  },

  /**
   * 判断是否是对象
   * @param obj
   * @return {boolean}
   */
  isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
  },

  /**
   * 移除对象中的空字符串
   * @param test
   * @param recurse
   */
  deleteEmptyString(test, recurse) {
    for (let i in test) {
      if (test[i] === '') {
        delete test[i]
      } else if (recurse && typeof test[i] === 'object') {
        this.deleteEmptyString(test[i], recurse)
      }
    }
  },

  /**
   * 删除对象中的空Key
   * @param test
   * @param recurse
   */
  deleteEmptyObject(test, recurse) {
    for (let i in test) {
      if (this.isEmpty(test[i])) {
        delete test[i]
      } else if (recurse && typeof test[i] === 'object') {
        this.deleteEmptyObject(test[i], recurse)
      }
    }
  },

  /**
   * 移除对象中的无效属性
   * @param obj
   * @return {*}
   */
  removeEmpty(obj) {
    Object.keys(obj).forEach(function (key) {
      ; (obj[key] && typeof obj[key] === 'object' && this.removeEmpty(obj[key])) ||
        ((obj[key] === undefined || obj[key] === null || obj[key] === '') && delete obj[key])
    })
    return obj
  },

  /**
   * 提取对象的部分键值属性
   * @param obj 对象
   * @param keys 键值数据
   */
  objectExtractprops(obj, keys) {
    return keys.reduce((result, key) => {
      if (obj.hasOwnProperty(key)) {
        result[key] = obj[key]
      }
      return result
    }, {})
  },

  /**
   * 深度拷贝
   * @param {*} obj
   */
  deepCloneObject(obj) {
    let objClone = Array.isArray(obj) ? [] : {}
    if (obj && typeof obj === 'object') {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          // 判断ojb子元素是否为对象，如果是，递归复制
          if (obj[key] && typeof obj[key] === 'object') {
            objClone[key] = this.deepCloneObject(obj[key])
          } else {
            // 如果不是，简单复制
            objClone[key] = obj[key]
          }
        }
      }
    }
    return objClone
  },

  /**
   * json对象转FormData
   * @param obj
   * @returns {*}
   */
  jsonToFormData(obj) {
    // 创建表单对象
    let formData = new FormData()
    if (obj) {
      for (let k in obj) {
        formData.append(k, obj[k])
      }
      // console.log('aa')
      // formData.append('aa', 123)
    }
    return formData
  },
  /**
   * 数组对象提取某个键值的数据至新数组
   * @param {*} arr 数组对象
   * @param {*} key 判断的键
   */
  extractArrayData(data, key) {
    let c = []
    let d = {}
    data.forEach(element => {
      if (!d[element[key]]) {
        c.push({
          category: element[key],
          allData: [element]
        })
        d[element[key]] = element
      } else {
        c.forEach(ele => {
          if (ele[key] === element[key]) {
            ele.allData.push(element)
          }
        })
      }
    })
    return c
  },
  /**
   * 图片预览
   * @param {*} file
   */
  previewImage(file, domId) {
    var MAXWIDTH = 260
    var MAXHEIGHT = 180
    var dom = domId || 'preview'
    var div = document.getElementById(dom)
    let _this = this
    if (file.files && file.files[0]) {
      div.innerHTML = '<img id=preview-' + dom + '>'
      var img = document.getElementById('preview-' + dom)
      img.onload = function () {
        var rect = _this.clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight)
        img.width = rect.width
        img.height = rect.height
        // img.style.marginLeft = rect.left+'px';
        img.style.marginTop = rect.top + 'px'
      }
      var reader = new FileReader()
      reader.onload = function (evt) {
        img.src = evt.target.result
      }
      reader.readAsDataURL(file.files[0])
    } else {
      // 兼容IE
      var sFilter =
        'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="'
      file.select()
      var src = document.selection.createRange().text
      div.innerHTML = '<img id=imghead>'
      let img = document.getElementById('imghead')
      img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src
      var rect = _this.clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight)
      // let status = ('rect:' + rect.top + ',' + rect.left + ',' + rect.width + ',' + rect.height);
      div.innerHTML =
        "<div id=divhead style='width:" +
        rect.width +
        'px;height:' +
        rect.height +
        'px;margin-top:' +
        rect.top +
        'px;' +
        sFilter +
        src +
        '"\'></div>'
    }
  },

  /**
   * 兼容性视图设置
   * @param {*} maxWidth
   * @param {*} maxHeight
   * @param {*} width
   * @param {*} height
   */

  clacImgZoomParam(maxWidth, maxHeight, width, height) {
    var param = { top: 0, left: 0, width: width, height: height }
    if (width > maxWidth || height > maxHeight) {
      let rateWidth = width / maxWidth
      let rateHeight = height / maxHeight

      if (rateWidth > rateHeight) {
        param.width = maxWidth
        param.height = Math.round(height / rateWidth)
      } else {
        param.width = Math.round(width / rateHeight)
        param.height = maxHeight
      }
    }
    param.left = Math.round((maxWidth - param.width) / 2)
    param.top = Math.round((maxHeight - param.height) / 2)
    return param
  },

  /**
   * 两数组的并集
   * @param {*} arr1
   * @param {*} arr2
   */
  arrUnion(arr1, arr2) {
    return Array.from(new Set([...arr1, ...arr2]))
  },

  /**
   * 两数组的交集
   * @param {*} arr1
   * @param {*} arr2
   */
  arrIntersection(arr1, arr2) {
    return Array.from(new Set([...arr1].filter(x => new Set(arr2).has(x))))
  },

  /**
   * 两数组的差集
   * @param {*} arr1
   * @param {*} arr2
   */
  arrDifference(arr1, arr2) {
    return Array.from(new Set([...arr1].filter(x => !new Set(arr2).has(x))))
  },

  /**
   * 多维数组递归降维
   * @param {*} arr
   */
  arrSteamroller(arr) {
    var newArr = []

    // for (var i = 0; i < arr.length; i++) {
    //   if (Array.isArray(arr[i])) {
    //     // 如果是数组，调用(递归)steamroller 将其扁平化
    //     // 然后再 push 到 newArr 中
    //     newArr.push.apply(newArr, this.arrSteamroller(arr[i]))
    //   } else {
    //     // 不是数组直接 push 到 newArr 中
    //     newArr.push(arr[i])
    //   }
    // }
    // return newArr
    newArr = arr.reduce((begin, current) => {
      Array.isArray(current) ? begin.push(...this.arrSteamroller(current)) : begin.push(current)
      return begin
    }, [])
    return newArr
  },

  /**
   * 统计数组各要素的个数
   * @param {*} arr
   */
  arrItemCount(arr) {
    return arr.reduce(function (prev, next) {
      prev[next] = prev[next] + 1 || 1
      return prev
    }, {})
  },

  /**
   * 数组对象根据某一键值排序
   * @param {*} arr 排序的数组对象
   * @param {*} key 排序的键
   */
  arrObjItemSort(arr, key) {
    arr.sort(function (a, b) {
      return b[key] - a[key]
    })
  },
  /**
   * 数组移除某一元素
   * @param {*} arr 排序的数组对象
   * @param {*} element 排序的键
   */
  arrRemoveElement(arr, element) {
    arr.splice(arr.findIndex(item => item === element), 1)
    return arr
  },
  /**
   * 数组对象根据某一键值去重
   * @param {*} arr 去重的数组对象
   * @param {*} key 去重的键
   */
  arrObjKeyUnique(arr, key) {
    const res = new Map()
    return arr.filter(a => !res.has(a[key]) && res.set(a[key], 1))
  },
  /**
   * 数组对象转为数组
   * @param {*} arr 去重的数组对象
   * @param {*} key 去重的键
   */

  /**
   * 日期格式化
   * @param {*} date new Date()对象
   * @param {*} fmt yyyy-MM-dd hh:mm:ss
   */
  dateFormat(date, fmt) {
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  },
  /**
   * 计算日期前X天的日期
   * @param {*} date new Date()对象
   * @param {*} day 前几天
   * @param {*} fmt yyyy-MM-dd hh:mm:ss
   */
  getPreDate(date, day, fmt) {
    let mydate = new Date()
    let predate = this.dataFormat(new Date(mydate.getTime() - Number(day) * 60 * 60 * 1000), fmt)
    return predate
  },
  /**
   * 提示弹出，封装antd
   * @param {*} message antd的message组件
   * @param {*} str 提示文字
   * @param {*} type 提示类型
   */
  toast(message, str, type) {
    if (str !== '') {
      message.destroy()
      message.config({
        top: document.documentElement.clientHeight - 200,
        duration: 1
      })
      switch (type) {
        case 'success':
          message.success(str)
          break
        case 'warning':
          message.warning(str)
          break
        case 'error':
          message.error(str)
          break
        case 'info':
          message.info(str)
          break
        default:
          message.warning(str)
      }
    }
  },
  /**
   * loading，封装antd
   * @param {*} message antd的message组件
   * @param {*} str 提示文字
   * @param {*} duration 持续时间
   * @param {*} onClose 关闭后的回调函数
   */
  loading(message, str, duration, onClose) {
    if (str !== '') {
      message.destroy()
      message.config({
        top: document.documentElement.clientHeight / 2
      })
      message.loading(str, duration, onClose)
    }
  },

  /**
   * 默认点击dom事件
   * @param {*} dom 需要点击的节点
   */
  imitateClick(dom) {
    if (dom) {
      let e = document.createEvent('MouseEvents')
      e.initEvent('click', true, true)
      dom.dispatchEvent(e)
    }
  },

  /**
   * 滚动效果
   * @param {*} animation 动画定时器
   * @param {*} slider 滑动节点
   * @param {*} dataRow 数据的行数
   * @param {*} showRow 展示的行数
   */
  animation(animation, slider, dataRow, showRow) {
    const H = parseFloat(this.getStyle(slider, 'height'))
    const child = slider.querySelector('tr')
    const h = parseFloat(this.getStyle(child, 'height'))
    const total = dataRow + showRow
    const spacing = (H - h * total) / (total + 1)

    let eachDistance // 每次动画移动的距离
    eachDistance = h + spacing
    const maxHeight = parseFloat(this.getStyle(slider, 'top')) - eachDistance * dataRow // 最大移动距离

    // 鼠标覆盖阀
    let isHover = false
    slider.parentNode.onmouseenter = function () {
      isHover = true
    }
    slider.parentNode.onmouseleave = function () {
      isHover = false
    }

    // 定时器
    let flag = true
    setInterval(() => {
      if (flag) {
        flag = false
        let current = parseFloat(this.getStyle(slider, 'top'))
        const target = current - eachDistance // 本次移动到位置
        if (isHover === false) {
          animation = setInterval(() => {
            let surplus = target - current // 剩余移动距离
            let step = surplus > 0 ? Math.ceil(surplus) / 10 : Math.floor(surplus) / 10
            if (Math.abs(surplus) >= 1) {
              slider.style.top = current + step + 'px'
            } else {
              if (target === maxHeight) {
                slider.style.top = 0 + 'px'
              } else {
                slider.style.top = target + 'px'
              }
              clearInterval(animation)
              flag = true
            }
            current = current + step
          }, 20)
        }
      }
    }, 5000)
  },

  /**
 * 获取元素父级元素
 * @param el // 当前对象
 * @param parentSelector // 父级对象
 * @return {*}
 */
  getParents(el, parentSelector /* optional */) {
    if (parentSelector === undefined) {
      parentSelector = "";
    }

    var p = el.parentNode;
    while (p.className.indexOf(parentSelector) === -1) {
      p = p.parentNode;
      if (p.tagName === "HTML") return;
    }
    return p;
  }
}
