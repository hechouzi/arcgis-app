import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import recompact from 'recompact'
import productUtilitis from '../../utils/productUtilitis';
import { layesConfig } from '../../config/arcgis_config/mapConfig';
import { gridData } from '../../data/gridData';
import { Checkbox } from 'antd'
import MapEcharts from './map_echarts';

const enhance = recompact.compose(
  connect(
    state => ({
      arcgisMapReducer: state.arcgisMapReducer
    })
  ),
  MapEcharts()
)
@enhance
class LayersControl extends Component {
  constructor(props) {
    super(props)
    this.layerArray = []
  }
  handleChange(e, type) {
    const { arcgisViewer } = this.props.arcgisMapReducer
    const { checked } = e.target
    switch (type) {
      // 等值线
      case 'Feature(line)':
        if (checked) {
          arcgisViewer.addFeatureLineLayer(
            layesConfig[0].name,
            layesConfig[0].value,
            layesConfig[0].expression,
            [0, 0, 255]
          )
        } else {
          arcgisViewer.removeLayers(layesConfig[0].name)
        }
        break;
      // 填充图
      case 'Feature(polygon)':
        if (checked) {
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
        } else {
          arcgisViewer.removeLayers(layesConfig[1].name)
        }
        break;
      // 普通feature
      case 'Feature':
        if (checked) {
          let expression = `NAME = '南京市'`
          arcgisViewer.addFeatureLayer(layesConfig[2].name, layesConfig[2].value, expression)
        } else {
          arcgisViewer.removeLayers(layesConfig[2].name)
        }
        break;
      // 动态图层
      case 'Dynamic':
        if (checked) {
          let layerDefinition = []
          layerDefinition[1] = `NAME = '南京市'`
          arcgisViewer.addDynamicLayer(
            layesConfig[3].name,
            layesConfig[3].value,
            layerDefinition
          )
        } else {
          arcgisViewer.removeLayers(layesConfig[3].name)
        }
        break;
      // CanvasImage
      case 'CanvasImage':
        if (checked) {
          axios.get('./data/canvasImageData.json').then(res => {
            if (res.status === 200) {
              let params = {
                id: 1,
                minx: 117.325157,
                maxx: 126.605055,
                miny: 18.488356,
                maxy: 41.736681,
                step: 0.009009009009009 // 1公里；0.009009009009009 , 500m: 0.0045045045045045
              }
              arcgisViewer.drawRasterGridLayer(params, res.data)
            }
          })
        } else {
          arcgisViewer.removeLayers('rasterGridLayer')
        }
      // 镶嵌数据集 mosaic
      case 'Mosaic':
        if (checked) {
          axios.get('./data/ProductCfg.xml').then(res => {
            let parser = new DOMParser()
            let xmldoc = parser.parseFromString(res.data, 'text/xml')
            // let mark = 'LST_H8'
            // let renderData = productUtilitis.getMosicalParam(mark, xmldoc)
            // baseMap
            //   .activeView
            //   .queryService(layesConfig[4].name, layesConfig[4].value, `Name = '201904181100'`, renderData)
            let mark = 'LST_H8'
            let renderData = productUtilitis.getMosicalParam(mark, xmldoc)
            arcgisViewer.queryService(
              'mosaicDataSet',
              layesConfig[4].value,
              `Name = '201904181100'`,
              renderData
            )
          })
        } else {
          arcgisViewer.removeLayers(layesConfig[4].name)
        }
        break;
      // 添加聚合图层
      case 'FlareCluster':
        if (checked) {
          axios.get('./data/flareClusterData.json').then(res => {
            arcgisViewer.addFlareClusterLayer(res.data, 'flare-cluster-layer', 75, 'lon', 'lat')
          })
        } else {
          arcgisViewer.removeLayers('flare-cluster-layer')
        }
        break;
      // 网格图层
      case 'gridLayer':
        if (checked) {
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
          // 遍历火点数据给格点数据插入数据
          gridData.forEach(item => {
            let j = Math.floor((item.longitude - lonExtent[0]) / step) // 行
            let i = Math.floor((item.latitude - latExtent[0]) / step) // 列
            let index = i * cellCount[0] + j
            data[index][2] = data[index][2] + 1
          })
          arcgisViewer.addGridGraphicLayer('gridLayer', data, step / 2)
        } else {
          arcgisViewer.removeLayers('gridLayer')
          arcgisViewer.removeLayers('gridLayerLabel')
        }
        break;
      // gis热力图
      case 'gisHeatLayer':
        if (checked) {
          axios.get('./data/heatMapData.json').then(res => {
            let data = res.data
            let heatMapPoints = []
            console.warn(data)
            data.forEach(item => {
              item.forEach(element => {
                let obj = {
                  lon: element.coord[0],
                  lat: element.coord[1],
                  value: element.elevation
                }
                heatMapPoints.push(obj)
              })
            })
            console.warn(heatMapPoints)
            arcgisViewer.drawHeatLayer(heatMapPoints, 'heatMapLayer')
          })
        } else {
          arcgisViewer.removeLayers('heatMapLayer')
        }
        break;
      // 迁徙图
      case 'Migration':
        if (checked) {
          axios.get('' + `/minigrate?category = '北京'`).then(res => {
            console.warn(res)
            let data = res.data.data
            let dealData = utils.extractArrayData(data, 'category')
            console.warn(dealData)
            let result = []
            dealData.forEach(item => {
              let itemData = [item.category]
              let dataItem = []
              item.allData.forEach(element => {
                let fromPlaceData = {
                  name: element.fromPlace
                }
                let toPlaceData = {
                  name: element.toPlace,
                  value: element.value
                }
                dataItem.push([fromPlaceData, toPlaceData])
              })
              itemData.push(dataItem)
              result.push(itemData)
            })
            console.warn(result)
            this.props.initChart('minigrate', result)
          })
        } else {
          this.props.clearChart()
        }
        break;
      // 热力图
      case 'HeatMap':
        if (checked) {
          axios.get('./data/heatMapData.json').then(res => {
            this.props.initChart('heat', res.data)
          })
        } else {
          this.props.clearChart()
        }
        break;
      // 热力图
      case 'wmsLayer':
        if (checked) {
          arcgisViewer.addWmsLayer()
        } else {
        }
        break;

      default:
        break;
    }
  }
  render() {
    return (
      <div className='layers-control'>
        <ul>
          <li>
            <Checkbox
              onChange={(v, type) => this.handleChange(v, 'Feature(line)')}
              value={'Feature(line)'}
            >
              Feature(line)
            </Checkbox>
          </li>
          <li>
            <Checkbox
              onChange={(v, type) => this.handleChange(v, 'Feature(polygon)')}
              value={'Feature(polygon)'}
            >
              Feature(polygon)
            </Checkbox>
          </li>
          <li>
            <Checkbox onChange={(v, type) => this.handleChange(v, 'Feature')} value={'Feature'}>
              Feature
            </Checkbox>
          </li>
          <li>
            <Checkbox onChange={(v, type) => this.handleChange(v, 'Dynamic')} value={'Dynamic'}>
              Dynamic
            </Checkbox>
          </li>
          <li>
            <Checkbox
              onChange={(v, type) => this.handleChange(v, 'CanvasImage')}
              value={'CanvasImage'}
            >
              CanvasImage
            </Checkbox>
          </li>
          <li>
            <Checkbox onChange={(v, type) => this.handleChange(v, 'Mosaic')} value={'Mosaic'}>
              Mosaic
            </Checkbox>
          </li>
          <li>
            <Checkbox
              onChange={(v, type) => this.handleChange(v, 'FlareCluster')}
              value={'FlareCluster'}
            >
              FlareCluster
            </Checkbox>
          </li>
          <li>
            <Checkbox onChange={(v, type) => this.handleChange(v, 'gridLayer')} value={'gridLayer'}>
              gridLayer
            </Checkbox>
          </li>
          <li>
            <Checkbox
              onChange={(v, type) => this.handleChange(v, 'gisHeatLayer')}
              value={'gisHeatLayer'}
            >
              gisHeatLayer
            </Checkbox>
          </li>
          <li>
            <Checkbox
              onChange={(v, type) => this.handleChange(v, 'pointLayer')}
              value={'pointLayer'}
            >
              pointLayer
            </Checkbox>
          </li>
          <li>
            <Checkbox onChange={(v, type) => this.handleChange(v, 'lineLayer')} value={'lineLayer'}>
              lineLayer
            </Checkbox>
          </li>
          <li>
            <Checkbox
              onChange={(v, type) => this.handleChange(v, 'polygonLayer')}
              value={'polygonLayer'}
            >
              polygonLayer
            </Checkbox>
          </li>
          <li>
            <Checkbox onChange={(v, type) => this.handleChange(v, 'Migration')} value={'Migration'}>
              echart-Migration
            </Checkbox>
          </li>
          <li>
            <Checkbox onChange={(v, type) => this.handleChange(v, 'HeatMap')} value={'HeatMap'}>
              echart-HeatMap
            </Checkbox>
          </li>
          <li>
            <Checkbox
              onChange={(v, type) => this.handleChange(v, 'wmsLayer')}
              value={'wmsLayer'}
            >
              wmsLayer
            </Checkbox>
          </li>
        </ul>
      </div>
    )
  }
}
export default LayersControl
