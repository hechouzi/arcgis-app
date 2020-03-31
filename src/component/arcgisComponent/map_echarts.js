import React from 'react'
import esriLoader from 'esri-loader'
import echarts from 'echarts'
import 'echarts/lib/chart/map'
import { geoCoordData } from '../../data/geoData'
/* 迁徙图组件 */

const Minigrate = instance => WrappedComponent => {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.type = '' // 图表类型  heat, minigrate
      this.data = [] // 数据体
    }
    componentDidMount() {
      console.log(this.props);
      const { arcgisViewer } = this.props.arcgisMapReducer
      if (Object.keys(arcgisViewer).length !== 0) {
        arcgisViewer.newMap.on('zoom-end', res => {
          this.reDraw()
        })
        arcgisViewer.newMap.on('pan-end', res => {
          this.reDraw()
        })
      }
    }
    // 重新绘制
    reDraw() {
      if (this.myChart && this.myChart.dispose) {
        this.myChart.dispose()
      }
      if (JSON.stringify(this.data) !== '[]') {
        this.initChart(this.type, this.data, true)
      }
    }
    // 清除图表
    clearChart = () => {
      if (this.myChart && this.myChart.dispose) {
        this.myChart.dispose()
        this.data = []
      }
    }
    // 初始化图表
    initChart = (type, paramData, isRedraw) => {
      if (!isRedraw) {
        // 初始化赋值， redraw不赋值
        this.data = paramData
        this.type = type
      }
      esriLoader.loadModules(['widgets/EChartsLayer3x']).then(([EChartsLayer]) => {
        let echartsObj = echarts
        let overlay = new EChartsLayer(this.props.arcgisMapReducer.arcgisViewer.newMap, echartsObj)
        let chartsContainer = overlay.getEchartsContainer()
        if (this.myChart && this.myChart.dispose) {
          this.myChart.dispose()
        }
        this.myChart = overlay.initECharts(chartsContainer)
        this.myChart.clear()
        window.onresize = this.myChart.resize
        let option =
          type === 'minigrate'
            ? this.getMinigrateChartOption(paramData)
            : type === 'heat'
              ? this.getHeatChartOption(paramData)
              : []
        this.myChart.setOption(option)
      })
    }
    // 获取热力图option
    getHeatChartOption(paramData) {
      let points = [].concat.apply(
        [],
        paramData.map(function (track) {
          return track.map(function (seg) {
            return seg.coord.concat([1])
          })
        })
      )
      let option = {
        animation: false,
        visualMap: {
          show: false,
          top: 'top',
          min: 0,
          max: 5,
          seriesIndex: 0,
          calculable: true,
          inRange: {
            color: ['blue', 'blue', 'green', 'yellow', 'red']
          }
        },
        series: [
          {
            type: 'heatmap',
            coordinateSystem: 'emap',
            data: points,
            pointSize: 5,
            blurSize: 6
          }
        ]
      }
      return option
    }
    // 获取迁徙图option
    getMinigrateChartOption(paramData) {
      let geoCoordMap = geoCoordData
      let planePath =
        'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z'
      let convertData = function (data) {
        let res = []
        for (let i = 0; i < data.length; i++) {
          let dataItem = data[i]
          let fromCoord = geoCoordMap[dataItem[0].name]
          let toCoord = geoCoordMap[dataItem[1].name]
          if (fromCoord && toCoord) {
            res.push({
              fromName: dataItem[0].name,
              toName: dataItem[1].name,
              numValue: dataItem[1].value,
              coords: [fromCoord, toCoord]
            })
          }
        }
        return res
      }
      // 设置Line和Point的颜色
      let LineColor = ['#ff3333', 'orange', 'lime', 'aqua']
      let series = []
      paramData.forEach(function (item, i) {
        series.push(
          {
            // 设置飞行线
            name: item[1],
            type: 'lines',
            zlevel: 1,
            coordinateSystem: 'emap',
            effect: {
              show: true,
              period: 6,
              trailLength: 0.5,
              color: '#fff',
              shadowBlur: 0,
              symbolSize: 3
            },
            lineStyle: {
              normal: {
                color: function (params) {
                  let num = params.data.numValue
                  if (num > 75) {
                    return LineColor[0]
                  } else if (num > 50) {
                    return LineColor[1]
                  } else if (num > 25) {
                    return LineColor[2]
                  } else {
                    return LineColor[3]
                  }
                },
                width: 1,
                curveness: 0.2
              }
            },
            data: convertData(item[1])
          },
          // 设置轨迹线
          {
            name: item[0].name,
            type: 'lines',
            zlevel: 2,
            coordinateSystem: 'emap',
            effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbol: planePath,
              symbolSize: 15
            },
            lineStyle: {
              normal: {
                color: function (params) {
                  let num = params.data.numValue
                  if (num > 75) {
                    return LineColor[0]
                  } else if (num > 50) {
                    return LineColor[1]
                  } else if (num > 25) {
                    return LineColor[2]
                  } else {
                    return LineColor[3]
                  }
                },
                width: 1,
                opacity: 0.6,
                curveness: 0.2
              }
            },
            data: convertData(item[1])
          },
          {
            // 设置点
            name: item[0],
            type: 'effectScatter',
            coordinateSystem: 'emap',
            zlevel: 2,
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              normal: {
                show: false,
                position: [8, -15],
                fontSize: 18,
                formatter: function (params) {
                  var res = params.value[2]
                  return res
                }
              }
            },
            symbolSize: function (val) {
              return val[2] / 20
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  let num = params.value[2]
                  if (num > 75) {
                    return LineColor[0]
                  } else if (num > 50) {
                    return LineColor[1]
                  } else if (num > 25) {
                    return LineColor[2]
                  } else {
                    return LineColor[3]
                  }
                }
              }
            },
            data: item[1].map(function (dataItem) {
              return {
                name: dataItem[1].name,
                value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
              }
            })
          }
        )
      })
      // 定义option
      let MinigrateOption = {
        title: {
          text: '',
          subtext: '',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          top: 'bottom',
          left: 'right',
          data: ['北京 Top10', '上海 Top10', '广州 Top10'],
          textStyle: {
            color: '#fff'
          },
          selectedMode: 'single'
        },
        geo: {
          map: '',
          label: {
            emphasis: {
              show: false
            }
          },
          roam: true,

          itemStyle: {
            normal: {
              areaColor: '#323c48',
              borderColor: '#404a59'
            },
            emphasis: {
              areaColor: '#2a333d'
            }
          }
        },
        series: series
      }
      return MinigrateOption
    }
    render() {
      console.warn(this.props)
      const props = {
        ...this.props,
        initChart: this.initChart,
        clearChart: this.clearChart
      }
      return <WrappedComponent {...props} />
    }
  }
}
export default Minigrate
