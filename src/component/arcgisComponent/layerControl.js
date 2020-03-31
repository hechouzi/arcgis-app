import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import productUtilitis from '../../utils/productUtilitis';
import { layesConfig } from '../../config/arcgis_config/mapConfig';
import { gridData } from '../../data/gridData';
@connect(
  state => ({
    arcgisMapReducer: state.arcgisMapReducer
  })
)
class LayerControl extends Component {
  constructor(props) {
    super(props)
    this.layerArray = [] // 图层名称数组
    this.flareClusterData = [] // 聚合图层数据
  }
  componentWillMount() {
    axios.get('./data/flareClusterData.json').then(res => {
      this.flareClusterData = res.data
    })
  }
  componentDidMount() {
    let layerControlDom = document.querySelector('.layer-control ul')
    layerControlDom.addEventListener('click', e => {
      const { arcgisViewer } = this.props.arcgisMapReducer
      if (e.target.outerText === '添加Feature(line)') {
        arcgisViewer.addFeatureLineLayer(
          layesConfig[0].name,
          layesConfig[0].value,
          layesConfig[0].expression,
          [0, 0, 255]
        )
        this.layerArray.push(layesConfig[0].name)
      }
      if (e.target.outerText === '添加Feature(polygon)') {
        arcgisViewer.addFeatureFillLayer(
          layesConfig[1].name,
          layesConfig[1].value,
          layesConfig[1].expression,
          layesConfig[1].valueArray,
          false,
          res => {
            console.warn(res)
          }
        )
        this.layerArray.push(layesConfig[1].name)
      }
      if (e.target.outerText === '添加Feature') {
        // let expression = `NAME = '南京市'`
        // arcgisViewer.addFeatureLayer(
        //   layesConfig[2].name,
        //   layesConfig[2].value,
        //   expression
        // )
        // this.layerArray.push(layesConfig[2].name)
      }
      if (e.target.outerText === '添加Dynamic') {
        // let layerDefinition = []
        // layerDefinition[1] = `NAME = '南京市'`
        // this.props.gisBaseMap.activeView.addDynamicLayer(
        //   layesConfig[3].name,
        //   layesConfig[3].value,
        //   layerDefinition
        // )
        // this.layerArray.push(layesConfig[3].name)
      }

      if (e.target.outerText === '添加镶嵌数据集') {
        axios.get('./data/ProductCfg.xml').then(res => {
          let parser = new DOMParser()
          let xmldoc = parser.parseFromString(res.data, 'text/xml')
          let mark = 'LST_H8'
          let renderData = productUtilitis.getMosicalParam(mark, xmldoc)
          arcgisViewer.queryService(
            layesConfig[4].name,
            layesConfig[4].value,
            `Name = '201904181100'`,
            renderData
          )
        })
      }
      // 聚合图层
      if (e.target.outerText === '添加聚合图层') {
        arcgisViewer.addFlareClusterLayer(
          this.flareClusterData,
          'flare-cluster-layer',
          75,
          'lon',
          'lat'
        )
        this.layerArray.push('flare-cluster-layer')
      }
      // 添加图片
      if (e.target.outerText === '添加图片') {
        let row = 900
        let col = 2000
        let canvasImg = document.createElement('canvas')
        let ctx2d = canvasImg.getContext('2d')
        canvasImg.width = 900
        canvasImg.height = 2000
        // function getRGB () {
        //   return Math.floor(Math.random() * 256)
        // }
        let imageData = ctx2d.getImageData(0, 0, row, col)
        let data = imageData.data
        let nums = 0
        debugger
        for (let i = 0; i < col; i++) {
          for (let j = 0; j < row; j++) {
            // ctx2d.arc(i * 20, j * 20, 20, 0, Math.PI * 2, false)
            // if (i >= 200 && i <= 300) {
            // if (j >= 200 && j <= 300) {
            // ctx2d.moveTo(i * 5, j * 5)
            ctx2d.fillRect(i, j, 1, 1)
            data[i * 4 * row + 4 * j + 0] = 84
            data[i * 4 * row + 4 * j + 1] = 249
            data[i * 4 * row + 4 * j + 2] = 2
            data[i * 4 * row + 4 * j + 3] = 255
            nums++
            // }
            // }
          }
        }
        ctx2d.putImageData(imageData, 0, 0)
        console.warn(nums)

        let canvasUrl = canvasImg.toDataURL('image/png')
        arcgisViewer.addPicRange('mapImageLayer', canvasUrl, [
          [126.605055, 41.736681],
          [117.325157, 18.488356]
        ])
      }
      // 添加格网
      if (e.target.outerText === '绘制格网图') {
        let step = 3 / 111 // 3代表3公里分辨率
        var latExtent = [34.587408, 40.746188] // 纬度范围
        var lonExtent = [110.211553, 114.563147] // 经度范围
        var cellCount = [
          Math.ceil((lonExtent[1] - lonExtent[0]) / step),
          Math.ceil((latExtent[1] - latExtent[0]) / step)
        ] // [0] 经度（列） [1] 纬度（行）

        let data = []
        for (let i = 0; i < cellCount[1]; i++) {
          // j 经度（列） i 纬度（行）
          for (let j = 0; j < cellCount[0]; j++) {
            // data.push([j, i, 0]) // echarts bining
            let lon = lonExtent[0] + (j + 1) * step - step / 2
            let lat = latExtent[0] + (i + 1) * step - step / 2
            data.push([lon, lat, 0])
          }
        }
        console.warn(data)
        // 遍历火点数据给格点数据插入数据
        gridData.forEach(item => {
          let j = Math.floor((item.longitude - lonExtent[0]) / step) // 行
          let i = Math.floor((item.latitude - latExtent[0]) / step) // 列
          let index = i * cellCount[0] + j
          data[index][2] = data[index][2] + 1
        })
        console.warn(data)
        arcgisViewer.addGridGraphicLayer('gridLayer', data, step / 2)
      }
      // 删除图层
      if (e.target.outerText === '删除图层') {
        arcgisViewer.removeMultiLayers(this.layerArray)
      }
      if (e.target.outerText === '属性查询') {
        arcgisViewer.executeQueryTask(layesConfig[2].value, `NAME = '南京市'`, ['*'], true)
          .then(res => {
            console.warn(res)
          })
      }
    })
  }
  render() {
    return (
      <div className='layer-control'>
        <ul>
          <li>点击</li>
          <li>添加Feature(line)</li>
          <li>添加Feature(polygon)</li>
          <li>添加Feature</li>
          <li>添加Dynamic</li>
          <li>添加图片</li>
          <li>添加镶嵌数据集</li>
          <li>添加聚合图层</li>
          <li>删除图层</li>
          <li>绘制点</li>
          <li>绘制线</li>
          <li>绘制面</li>
          <li>绘制格网图</li>
          <li>属性查询</li>
        </ul>
      </div>
    )
  }
}
export default LayerControl