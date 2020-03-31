import { allColor } from '../../config/arcgis_config/allColor'
import { tdtConfigInfo, tiledMapService } from '../../config/arcgis_config/mapConfig'
import DataManager from '../../config/arcgis_config/cluster/DataManager'
import { getColor } from '../../config/arcgis_config/renderColors'
import utils from '../utilitis'

export default class ArcgisApp {
  constructor(
    initMap,
    map,
    gaodeLayer,
    googleLayer,
    FeatureLayer,
    GraphicsLayer,
    ArcGISTiledMapServiceLayer,
    ArcGISDynamicMapServiceLayer,
    WMSLayer,
    WMSLayerInfo,
    MapImageLayer,
    MapImage,
    SpatialReference,
    SimpleLineSymbol,
    SimpleFillSymbol,
    SimpleMarkerSymbol,
    QueryTask,
    query,
    LabelClass,
    Font,
    Color,
    UniqueValueRenderer,
    TextSymbol,
    ArcGISImageServiceLayer,
    RasterFunction,
    IdentifyTask,
    IdentifyParameters,
    ImageServiceParameters,
    ImageServiceIdentifyTask,
    ImageServiceIdentifyParameters,
    WebTiledLayer,
    TileInfo,
    draw,
    Popup,
    domConstruct,
    Graphic,
    Point,
    Polyline,
    Polygon,
    GeometryService,
    LengthsParameters,
    AreasAndLengthsParameters,
    PopupTemplate,
    FlareClusterLayer,
    ClassBreaksRenderer,
    Extent,
    ScreenPoint,
    MosaicRule,
    WebMercatorUtils,
    geometryEngine,
    FeatureSet,
    HeatmapRenderer
  ) {
    this.initMap = initMap
    this.gaodeLayer = gaodeLayer
    this.googleLayer = googleLayer
    this.FeatureLayer = FeatureLayer
    this.GraphicsLayer = GraphicsLayer
    this.ArcGISTiledMapServiceLayer = ArcGISTiledMapServiceLayer
    this.ArcGISDynamicMapServiceLayer = ArcGISDynamicMapServiceLayer
    this.WMSLayer = WMSLayer
    this.WMSLayerInfo = WMSLayerInfo
    this.MapImageLayer = MapImageLayer
    this.MapImage = MapImage
    this.SpatialReference = SpatialReference
    this.SimpleLineSymbol = SimpleLineSymbol
    this.SimpleFillSymbol = SimpleFillSymbol
    this.SimpleMarkerSymbol = SimpleMarkerSymbol
    this.QueryTask = QueryTask
    this.Query = query
    this.LabelClass = LabelClass
    this.Font = Font
    this.Color = Color
    this.UniqueValueRenderer = UniqueValueRenderer
    this.TextSymbol = TextSymbol
    this.ArcGISImageServiceLayer = ArcGISImageServiceLayer
    this.RasterFunction = RasterFunction
    this.IdentifyTask = IdentifyTask
    this.IdentifyParameters = IdentifyParameters
    this.ImageServiceParameters = ImageServiceParameters
    this.ImageServiceIdentifyTask = ImageServiceIdentifyTask
    this.ImageServiceIdentifyParameters = ImageServiceIdentifyParameters
    this.WebTiledLayer = WebTiledLayer
    this.TileInfo = TileInfo
    this.draw = draw
    this.Popup = Popup
    this.domConstruct = domConstruct
    this.Graphic = Graphic
    this.Point = Point
    this.Polyline = Polyline
    this.Polygon = Polygon
    this.GeometryService = GeometryService
    this.LengthsParameters = LengthsParameters
    this.AreasAndLengthsParameters = AreasAndLengthsParameters
    this.PopupTemplate = PopupTemplate
    this.FlareClusterLayer = FlareClusterLayer
    this.ClassBreaksRenderer = ClassBreaksRenderer
    this.Extent = Extent
    this.ScreenPoint = ScreenPoint
    this.MosaicRule = MosaicRule
    this.WebMercatorUtils = WebMercatorUtils
    this.geometryEngine = geometryEngine
    this.FeatureSet = FeatureSet
    this.HeatmapRenderer = HeatmapRenderer
    /* 弹出框 */
    this.popup = new this.Popup(null, this.domConstruct.create('div'))

    this.newMap = new map(this.initMap.domID, {
      logo: false,
      slider: false,
      showAttribution: false,
      showLabels: true,
      zoom: this.initMap.zoom,
      center: this.initMap.center,
      infoWindow: this.popup,
      minZoom: 2, // 最小空间等级
      maxZoom: 10 // 最大空间等级
    })
    // 高德地图
    this.gaodeDigitalLayer = new this.gaodeLayer({
      id: 'gaode_road',
      layertype: 'road'
    })
    this.gaodeSatelliteLayer = new this.gaodeLayer({
      id: 'gaode_st',
      layertype: 'st'
    })
    this.gaodeLabelLayer = new this.gaodeLayer({
      id: 'gaode_label_st',
      layertype: 'label'
    })
    // 谷歌地图
    this.googleDigitalLayer = new this.googleLayer({
      id: 'google_road',
      layertype: 'road'
    })
    this.googleSatelliteLayer = new this.googleLayer({
      id: 'google_st',
      layertype: 'st'
    })
    this.googleLabelLayer = new this.googleLayer({
      id: 'google_label_st',
      layertype: 'label'
    })
    this.googleTerrainLayer = new this.googleLayer({
      id: 'google_terrain',
      layertype: 'terrain'
    })
    // 天地图
    let tileInfo = new this.TileInfo(tdtConfigInfo.tileInfo)
    this.tdtDigitalLayer = new this.WebTiledLayer(tdtConfigInfo.roadLayer, {
      id: 'tdt_road',
      tileInfo: tileInfo
    })
    this.tdtSatelliteLayer = new this.WebTiledLayer(tdtConfigInfo.stLayer, {
      id: 'tdt_st',
      tileInfo: tileInfo
    })
    this.tdtLabelLayer = new this.WebTiledLayer(tdtConfigInfo.labelLayer, {
      id: 'tdt_label_st_road',
      tileInfo: tileInfo
    })
    // 地图切片
    this.tiledStreetServiceLayer = new this.ArcGISTiledMapServiceLayer(tiledMapService.street, {
      id: 'tiled_road'
    })
    this.tiledSatelliteServiceLayer = new this.ArcGISTiledMapServiceLayer(
      tiledMapService.satellite,
      {
        id: 'tiled_st'
      }
    )
    this.tiledTerrainServiceLayer = new this.ArcGISTiledMapServiceLayer(tiledMapService.terrain, {
      id: 'tiled_terrain'
    })
    this.allBaseMap = [] // 所有地图底图
    this.displayLaye = new Map() // 显示图层
    this.initMapMethod()
    // 框选范围用
    this.mapDraw = new this.draw(this.newMap, {})
    // 测量距离面积用
    this.toolbar = new this.draw(this.newMap)
    // 测量用图层
    this.measureGraphicsLayer = new this.GraphicsLayer({
      id: 'measureGraphicsLayer'
    })
    this.newMap.addLayer(this.measureGraphicsLayer)
    // 鼠标移入事件
    this.newMap.on('mouse-move', res => { })
    // 禁止键盘拖动事件
    this.newMap.disableKeyboardNavigation()
    // 地图范围改变事件
    this.mapExtentChange()
    // 栅格格网数据的参数
    this.rasterGridParams = {}
    // 当前地图的extent
    this.currentExtent = {}
    // 初始化数据体entent
    this.initDataExtent = {}
  }
  /**
   * 添加底图
   */
  initMapMethod() {
    if (this.initMap.baseMapType === 'google') {
      this.allBaseMap = [this.googleDigitalLayer, this.googleSatelliteLayer, this.googleTerrainLayer]
    } else if (this.initMap.baseMapType === 'gaode') {
      this.allBaseMap = [this.gaodeDigitalLayer, this.gaodeSatelliteLayer, this.gaodeLabelLayer]
    } else if (this.initMap.baseMapType === 'tdt') {
      this.allBaseMap = [this.tdtDigitalLayer, this.tdtSatelliteLayer, this.tdtLabelLayer]
    } else if (this.initMap.baseMapType === 'tiled') {
      this.allBaseMap = [this.tiledStreetServiceLayer, this.tiledSatelliteServiceLayer, this.tiledTerrainServiceLayer]
    }
    this.allBaseMap.forEach(item => {
      if (item.id.indexOf(this.initMap.mapType) > 0) {
        item.show()
      } else {
        item.hide()
      }
    })
    this.newMap.addLayers(this.allBaseMap)
  }
  /**
   * 底图切换
   * @param {string} key 图层类型
   */
  switchBasemap(key) {
    // this.basemaps.aelorme = {
    //   baseMapLayers: [{ url: 'http://192.168.1.236:6080/arcgis/rest/services/eastChinaSea/eastSeaMap/MapServer' }
    //   ],
    //   thumbnailUrl: 'https://www.example.com/images/thumbnail_2014-11-25_61051.png',
    //   title: 'Aelorme'
    // }
    // this.newMap.setBasemap('aelorme')
    this.allBaseMap.forEach(item => {
      if (item.id.indexOf(key) > 0) {
        item.show()
      } else {
        item.hide()
      }
    })
  }
  /**
   * 查询图层
   * @param {string} layerName 图层id或者图层索引
   */
  queryLayers(layerName) {
    let type = typeof layerName
    let layerInfo =
      type === 'number'
        ? this.newMap.getLayer(this.newMap.layerIds[layerName])
        : this.newMap.getLayer(layerName)
    return layerInfo
  }
  /*
   *查询所有图层
   * */
  queryAllLayers() {
    let layers = this.newMap.getLayersVisibleAtScale(this.newMap.getScale())
    return layers
  }
  /**
   * 移除图层
   * @param {string} layerName 图层id或者图层索引
   */
  removeLayers(layerName) {
    let layerInfo = this.queryLayers(layerName)
    if (layerInfo) {
      this.newMap.removeLayer(layerInfo)
    }
  }
  /**
   * 移除多图层
   * @param {Array} removeLayers 图层数组
   */
  removeMultiLayers(removeLayers = []) {
    let allLayers = this.queryAllLayers()
    for (let i = 0; i < allLayers.length; i++) {
      for (let j = 0; j < removeLayers.length; j++) {
        if (allLayers[i].id === removeLayers[j]) {
          if (this.newMap) {
            let layerType = removeLayers[j].includes('windParticle')
              ? 2
              : removeLayers[j].includes('windArrow') ||
                removeLayers[j].includes('windPlume') ||
                removeLayers[j].includes('surface_fillGraph')
                ? 1
                : removeLayers[j].includes('surface_fillGraph') ||
                  removeLayers[j].includes('depth_fillGraph')
                  ? 4
                  : 0
            this.removeLayers(allLayers[i].id, layerType)
          }
        }
      }
    }
  }
  /**
   * 视图定位
   * @param {Array} point 经纬度([lon,lat])
   */
  reorientView(point) {
    this.newMap.centerAt(point)
  }
  /**
   * 视图定位(含放大系数)
   * @param {Array} point 经纬度([lon,lat])
   * @param {Number} zoom 放大系数
   */
  reorientViewAndZoom(point, zoom) {
    point[0] = parseFloat(point[0])
    point[1] = parseFloat(point[1])
    this.newMap.centerAndZoom(point, zoom)
  }
  /**
   * 添加带有查询的矢量图层(添加等值线)
   * @param {String} layerName:图层名
   * @param {String} url:图层路径
   * @param {String} expression:查询条件
   * @param {Array} color:等值线颜色 颜色数组 [0,0,255]
   */
  addFeatureLineLayer(layerName, url, expression, color) {
    let featherLayer = this.queryLayers(layerName)
    let definitionExpression = expression
    let lineSymbol = new this.SimpleLineSymbol(
      this.SimpleLineSymbol.STYLE_SOLID,
      new this.Color(color),
      1
    )
    // 定义唯一值渲染器，对字段RENDER进行渲染，lineSymbol是默认的渲染符号
    let renderer = new this.UniqueValueRenderer(lineSymbol, 'RENDER')
    // 定义label渲染方案
    let labelSymbol = new this.TextSymbol()
      .setColor(new this.Color(color))
      .setFont(new this.Font('12pt').setWeight(this.Font.WEIGHT_BOLD))
    let json = {
      labelExpressionInfo: { value: '{VALUE}' },
      useCodedValues: false,
      labelPlacement: 'above-right',
      fieldInfos: [{ fieldName: 'VALUE' }]
    }
    let labelClass = new this.LabelClass(json)
    labelClass.symbol = labelSymbol

    if (featherLayer) {
      // this.newMap.removeLayer(featherLayer)
      featherLayer.setDefinitionExpression(definitionExpression)
      featherLayer.setRenderer(renderer)
      featherLayer.setLabelingInfo([labelClass])
    } else {
      featherLayer = new this.FeatureLayer(url, {
        id: layerName,
        showLabels: true
      })
      featherLayer.setDefinitionExpression(definitionExpression)
      featherLayer.setRenderer(renderer)
      featherLayer.setLabelingInfo([labelClass])
    }
    this.newMap.addLayer(featherLayer)
  }
  /**
   * 添加带有查询的矢量图层(添加填充图)
   * @param {String} layerName:图层名
   * @param {String} url:图层路径
   * @param {String} expression:查询条件
   * @param {Array} valueArray:分级值的数组
   * @param {boolean} flag：是否去除最小值，ture去除，false不去除
   */
  addFeatureFillLayer(layerName, url, expression, valueArray, flag, callback) {
    let featherLayer = this.queryLayers(layerName)
    let definitionExpression = expression

    let colorStep = Math.floor(allColor.length / (valueArray.length + 1))
    let colorArray = []
    allColor.forEach((item, index) => {
      if (index % colorStep === 0) colorArray.push(item)
    })

    let lineSymbol = new this.SimpleLineSymbol(
      this.SimpleLineSymbol.STYLE_DASH,
      new this.Color([255, 0, 0, 0]),
      1
    )
    let fill = new this.SimpleFillSymbol(
      this.SimpleFillSymbol.STYLE_SOLID,
      lineSymbol,
      new this.Color('#FFFFCC')
    )
    // 定义唯一值渲染器，对字段alias进行渲染，fill是默认的渲染符号
    let renderer = new this.UniqueValueRenderer(fill, 'RENDER')

    valueArray.forEach((item, index) => {
      // let selectColor = allColor[index * colorStep]
      // let selectColor2 = allColor[index * colorStep + 1]
      if (index === 0) {
        if (flag === true) {
          renderer.addValue(
            item + '_0',
            new this.SimpleFillSymbol(
              this.SimpleFillSymbol.STYLE_SOLID,
              lineSymbol,
              new this.Color([colorArray[index][1], colorArray[index][2], colorArray[index][3], 0])
            )
          )
          renderer.addValue(
            item + '_1',
            new this.SimpleFillSymbol(
              this.SimpleFillSymbol.STYLE_SOLID,
              lineSymbol,
              new this.Color([
                colorArray[index + 1][1],
                colorArray[index + 1][2],
                colorArray[index + 1][3]
              ])
            )
          )
        } else {
          renderer.addValue(
            item + '_0',
            new this.SimpleFillSymbol(
              this.SimpleFillSymbol.STYLE_SOLID,
              lineSymbol,
              new this.Color([colorArray[index][1], colorArray[index][2], colorArray[index][3]])
            )
          )
          renderer.addValue(
            item + '_1',
            new this.SimpleFillSymbol(
              this.SimpleFillSymbol.STYLE_SOLID,
              lineSymbol,
              new this.Color([
                colorArray[index + 1][1],
                colorArray[index + 1][2],
                colorArray[index + 1][3]
              ])
            )
          )
        }
      } else {
        renderer.addValue(
          item + '_0',
          new this.SimpleFillSymbol(
            this.SimpleFillSymbol.STYLE_SOLID,
            lineSymbol,
            new this.Color([colorArray[index][1], colorArray[index][2], colorArray[index][3]])
          )
        )
        renderer.addValue(
          item + '_1',
          new this.SimpleFillSymbol(
            this.SimpleFillSymbol.STYLE_SOLID,
            lineSymbol,
            new this.Color([
              colorArray[index + 1][1],
              colorArray[index + 1][2],
              colorArray[index + 1][3]
            ])
          )
        )
      }
    })

    if (featherLayer) {
      featherLayer.setDefinitionExpression(definitionExpression)
      featherLayer.setRenderer(renderer)
    } else {
      featherLayer = new this.FeatureLayer(url, {
        id: layerName,
        showLabels: true,
        opacity: 0.7
      })
      featherLayer.setDefinitionExpression(definitionExpression)
      featherLayer.setRenderer(renderer)
    }
    this.newMap.addLayer(featherLayer)
    featherLayer.on('update-end', res => {
      if (callback && res.error === false) {
        let data = {
          status: 'ok'
        }
        callback(data)
      }
    })
  }
  /**
   * 添加普通矢量图层
   * @param {String} layerName:图层名
   * @param {String} url:图层路径
   */
  addWmsLayer() {
    let wmsLayer = new this.WMSLayer('http://211.154.196.4:18085/geoserver/fire/wms', {
      format: 'png',
      resourceInfo: {
        copyright: 'GeoServer',
        description: 'china',
        extent: new this.Extent(-20037508.342787, -20037508.342787, 20037508.342787, 20037508.342787, {
          wkid: 102113
        }),
        featureInfoFormat: 'text/html',
        layerInfos: [
          new this.WMSLayerInfo({
            name: 'fire:htht_cluster_schedule_fire_info',
            title: 'china_all',
            tileMatrixSet: 'EPSG:102113',
            queryable: true,
            showPopup: true
          })
        ],
        spatialReferences: [102113], // 坐标系
        version: '1.1.1'
      },
      version: '1.1.1',
      visibleLayers: [
        'fire:htht_cluster_schedule_fire_info' // 命名空间:图层
      ]
    })
    this.newMap.addLayer(wmsLayer)
  }
  /**
   * 添加普通矢量图层
   * @param {String} layerName:图层名
   * @param {String} url:图层路径
   */
  addFeatureLayer(layerName, url, expression) {
    let featherLayer = this.queryLayers(layerName)
    if (featherLayer) {
      this.removeLayers(featherLayer)
    } else {
      featherLayer = new this.FeatureLayer(url, {
        id: layerName,
        showLabels: true,
        outFields: ['*'],
        opacity: 0.7
      })
      if (expression) {
        featherLayer.setDefinitionExpression(expression)
      }
    }
    this.newMap.addLayer(featherLayer)
    this.layerClick(featherLayer)
  }
  /**
   * 添加普通动态图层
   * @param {String} layerName:图层名
   * @param {String} url:图层路径
   */
  addDynamicLayer(layerName, url, layerDefinition) {
    let dynamicLayer = this.queryLayers(layerName)
    if (dynamicLayer) {
      this.removeLayers(dynamicLayer)
    } else {
      dynamicLayer = new this.ArcGISDynamicMapServiceLayer(url, {
        id: layerName,
        opacity: 0.8
      })
      if (layerDefinition) {
        dynamicLayer.setLayerDefinitions(layerDefinition)
      }
    }
    this.newMap.addLayer(dynamicLayer)
    this.executeDynamicIdentify(url)
  }
  /**
   * 普通动态图层探针
   * @param {String} dynamicServer:图层路径
   * @param {String} url:图层路径
   */
  executeDynamicIdentify(dynamicServer) {
    let identifyTask = new this.IdentifyTask(dynamicServer)
    let params = new this.IdentifyParameters()
    this.mapClick(res => {
      let mapPoint = res.evt.mapPoint
      let mapExtent = this.newMap.extent
      if (mapPoint.spatialReference.isWebMercator()) {
        mapPoint = this.WebMercatorUtils.webMercatorToGeographic(mapPoint)
        mapExtent = this.WebMercatorUtils.webMercatorToGeographic(this.newMap.extent)
      }
      let layerDefinition = []
      layerDefinition[0] = '1 = 1'
      layerDefinition[1] = '1 = 1'
      // params.layerIds = [1]
      params.geometry = mapPoint
      params.mapExtent = mapExtent
      params.tolerance = 5
      params.layerOption = this.IdentifyParameters.LAYER_OPTION_VISIBLE
      params.layerDefinitions = layerDefinition
      identifyTask.execute(params).then(result => {
        console.warn(result)
      })
    })
  }
  /**
   * 添加聚合图层
   * @param {Array} data:点击数据
   * @param {Number} clusterRatio:聚合半径
   * @param {String} lon: 经度键值
   * @param {String} lat: 纬度键值
   */
  addFlareClusterLayer(data, layerName, clusterRatio, lon, lat) {
    let _this = this
    DataManager.setData(data)
    var preClustered = false
    var displaySingleFlaresAtCount = 10
    var areaDisplayMode = 'hover'

    // init the layer, more options are available and explained in the cluster layer constructor
    var clusterLayer = new this.FlareClusterLayer({
      id: layerName,
      spatialReference: new this.SpatialReference({ wkid: 4326 }),
      subTypeFlareProperty: 'facilityType',
      singleFlareTooltipProperty: 'name',
      displaySubTypeFlares: true,
      displaySingleFlaresAtCount: displaySingleFlaresAtCount,
      flareShowMode: 'mouse',
      preClustered: preClustered,
      clusterRatio: clusterRatio,
      clusterAreaDisplay: areaDisplayMode,
      clusteringBegin: function () {
        // console.log('clustering begin')
      },
      clusteringComplete: function () {
        // console.log('clustering complete')
      }
    })

    // set up a class breaks renderer to render different symbols based on the cluster count. Use the required clusterCount property to break on.
    var defaultSym = new this.SimpleMarkerSymbol()
      .setSize(6)
      .setColor('#FF0000')
      .setOutline(null)
    var renderer = new this.ClassBreaksRenderer(defaultSym, 'clusterCount')
    var xlSymbol = new this.SimpleMarkerSymbol(
      this.SimpleMarkerSymbol.STYLE_CIRCLE,
      32,
      new this.SimpleLineSymbol(
        this.SimpleLineSymbol.STYLE_SOLID,
        new this.Color([200, 52, 59, 0.8]),
        1
      ),
      new this.Color([250, 65, 74, 0.8])
    )
    var lgSymbol = new this.SimpleMarkerSymbol(
      this.SimpleMarkerSymbol.STYLE_CIRCLE,
      28,
      new this.SimpleLineSymbol(
        this.SimpleLineSymbol.STYLE_SOLID,
        new this.Color([41, 163, 41, 0.8]),
        1
      ),
      new this.Color([51, 204, 51, 0.8])
    )
    var mdSymbol = new this.SimpleMarkerSymbol(
      this.SimpleMarkerSymbol.STYLE_CIRCLE,
      24,
      new this.SimpleLineSymbol(
        this.SimpleLineSymbol.STYLE_SOLID,
        new this.Color([82, 163, 204, 0.8]),
        1
      ),
      new this.Color([102, 204, 255, 0.8])
    )
    var smSymbol = new this.SimpleMarkerSymbol(
      this.SimpleMarkerSymbol.STYLE_CIRCLE,
      22,
      new this.SimpleLineSymbol(
        this.SimpleLineSymbol.STYLE_SOLID,
        new this.Color([230, 184, 92, 0.8]),
        1
      ),
      new this.Color([255, 204, 102, 0.8])
    )
    renderer.addBreak(0, 19, smSymbol)
    renderer.addBreak(20, 150, mdSymbol)
    renderer.addBreak(151, 1000, lgSymbol)
    renderer.addBreak(1001, Infinity, xlSymbol)

    if (areaDisplayMode) {
      // if area display mode is set. Create a renderer to display cluster areas. Use SimpleFillSymbols as the areas are polygons
      var defaultAreaSym = new this.SimpleFillSymbol()
        .setStyle(this.SimpleFillSymbol.STYLE_SOLID)
        .setColor(new this.Color([0, 0, 0, 0.2]))
        .setOutline(
          new this.SimpleLineSymbol(
            this.SimpleLineSymbol.STYLE_SOLID,
            new this.Color([0, 0, 0, 0.3]),
            1
          )
        )
      var areaRenderer = new this.ClassBreaksRenderer(defaultAreaSym, 'clusterCount')
      var xlAreaSymbol = new this.SimpleFillSymbol(
        this.SimpleFillSymbol.STYLE_SOLID,
        new this.SimpleLineSymbol(
          this.SimpleLineSymbol.STYLE_SOLID,
          new this.Color([200, 52, 59, 0.8]),
          1
        ),
        new this.Color([250, 65, 74, 0.8])
      )
      var lgAreaSymbol = new this.SimpleFillSymbol(
        this.SimpleFillSymbol.STYLE_SOLID,
        new this.SimpleLineSymbol(
          this.SimpleLineSymbol.STYLE_SOLID,
          new this.Color([41, 163, 41, 0.8]),
          1
        ),
        new this.Color([51, 204, 51, 0.8])
      )
      var mdAreaSymbol = new this.SimpleFillSymbol(
        this.SimpleFillSymbol.STYLE_SOLID,
        new this.SimpleLineSymbol(
          this.SimpleLineSymbol.STYLE_SOLID,
          new this.Color([82, 163, 204, 0.8]),
          1
        ),
        new this.Color([102, 204, 255, 0.8])
      )
      var smAreaSymbol = new this.SimpleFillSymbol(
        this.SimpleFillSymbol.STYLE_SOLID,
        new this.SimpleLineSymbol(
          this.SimpleLineSymbol.STYLE_SOLID,
          new this.Color([230, 184, 92, 0.8]),
          1
        ),
        new this.Color([255, 204, 102, 0.8])
      )

      areaRenderer.addBreak(0, 19, smAreaSymbol)
      areaRenderer.addBreak(20, 150, mdAreaSymbol)
      areaRenderer.addBreak(151, 1000, lgAreaSymbol)
      areaRenderer.addBreak(1001, Infinity, xlAreaSymbol)

      // use the custom overload of setRenderer to include the renderer for areas.
      clusterLayer.setRenderer(renderer, areaRenderer)
    } else {
      clusterLayer.setRenderer(renderer) // use standard setRenderer.
    }

    // set up a popup template
    var template = new this.PopupTemplate({
      title: '{name}',
      fieldInfos: [
        { fieldName: 'facilityType', label: 'Facility Type', visible: true },
        { fieldName: 'postcode', label: 'Post Code', visible: true },
        { fieldName: 'isOpen', label: 'Opening Hours', visible: true }
      ]
    })
    clusterLayer.infoTemplate = template
    this.newMap.infoWindow.titleInBody = false

    this.newMap.addLayer(clusterLayer)

    // get the first set of data
    if (preClustered) {
      getPreClusteredGraphics(clusterRatio)
    } else {
      // not preclustered - just add the raw data to be clusted within the layer.
      var clusterData = DataManager.getData()
      clusterLayer.addData(clusterData)
    }
    function getPreClusteredGraphics(clusterRatio) {
      var maxSingleFlareCount = displaySingleFlaresAtCount

      var clusteredData = DataManager.fakeServerSideClustering(
        clusterRatio,
        maxSingleFlareCount,
        areaDisplayMode,
        _this.newMap,
        _this.Extent,
        _this.SpatialReference,
        _this.ScreenPoint
      )
      clusterLayer.addPreClusteredData(clusteredData)
    }
  }
  /**
   * 在指定经纬度范围内添加单个图片（不适用播放）
   * @param {String} layerName: 图层名
   * @param {String} url: 图片路径
   * @param {Array} range: 位置([[maxx,maxy],[minx,miny]])
   * @param {boolean} needLocation: 是否需要定位
   * @param {Number} zoom: 高度
   * @param {Number} index: 图层索引
   */
  addPicRange(layerName, url, range) {
    let imgLayer = this.queryLayers(layerName)
    if (imgLayer) {
      imgLayer.removeAllImages()
    } else {
      imgLayer = new this.MapImageLayer({
        id: layerName,
        opacity: 0.9
      })
      this.newMap.addLayer(imgLayer, 9999)
    }
    let maxx = range[0][0]
    let minx = range[1][0]
    let maxy = range[0][1]
    let miny = range[1][1]

    let mi = new this.MapImage({
      extent: {
        xmin: minx,
        ymin: miny,
        xmax: maxx,
        ymax: maxy,
        spatialReference: { wkid: 4326 }
      },
      href: url
    })
    imgLayer.addImage(mi)

    // if (flag) {
    //   let imageArray = imgLayer.getImages()
    //   setTimeout(() => {
    //     for (let i = 0; i < imageArray.length; i++) {
    //       if (i !== imageArray.length - 1) {
    //         imgLayer.removeImage(imageArray[i])
    //       }
    //     }
    //   }, 500)
    // }

    // if (needLocation) {
    //   if (zoom) {
    //     this.reorientViewAndZoom(centerPoint, zoom)
    //   } else {
    //     this.reorientView(centerPoint)
    //   }
    // }
  }
  /**
   * 查询镶嵌数据集
   * @param {String} layerName:图层名
   * @param {String} url:arcgis服务
   * @param {String} queryInfo:查询内容
   * @param {Object} renderData:渲染方法
   */
  queryService(layerName, url, queryInfo, renderData) {
    let resampleRF = new this.RasterFunction({
      functionName: 'Resample',
      variableName: 'Raster',
      functionArguments: {
        ResamplingType: 1,
        Raster: '$$'
      }
    })
    let remapRF = new this.RasterFunction()
    remapRF.functionName = 'Remap'
    remapRF.functionArguments = {
      InputRanges: renderData.inputRanges,
      OutputValues: renderData.outputValues,
      Raster: resampleRF
    }
    remapRF.outputPixelType = 'U8'
    let ColorFunction = new this.RasterFunction()
    ColorFunction.functionName = 'Colormap'
    ColorFunction.functionArguments = {
      Colormap: renderData.colorMap,
      Raster: remapRF
    }
    let params = new this.ImageServiceParameters()
    params.renderingRule = ColorFunction

    let serviceLayer = new this.ArcGISImageServiceLayer(url, {
      id: layerName,
      opacity: 0.7,
      imageServiceParameters: params
    })
    serviceLayer.setDefinitionExpression(queryInfo)
    this.newMap.addLayer(serviceLayer)
    this.excuteMosaicIdentify(url, queryInfo)
  }
  /**
   * 镶嵌数据集探针
   * @param {String} mapURL 服务路径
   * @param {String} queryInfo 查询条件
   */
  excuteMosaicIdentify(mapURL, queryInfo) {
    const identifyTask = new this.ImageServiceIdentifyTask(mapURL)
    const imageParams = new this.ImageServiceIdentifyParameters()
    let mosaicRule = new this.MosaicRule({
      where: queryInfo
    })
    this.mapClick(res => {
      let mapPoint = res.evt.mapPoint
      // xyToLngLat（x, y） 墨卡托转经纬度；
      // lngLatToXY(long, lat) 经纬度转墨卡托
      // geographicToWebMercator（geomotry） 经纬度转墨卡托
      // webMercatorToGeographic(geometry, isLinear?) 墨卡托转经纬度
      if (mapPoint.spatialReference.isWebMercator()) {
        mapPoint = this.WebMercatorUtils.webMercatorToGeographic(mapPoint)
      }
      imageParams.geometry = mapPoint
      imageParams.returnPixelValues = true
      imageParams.mosaicRule = mosaicRule
      identifyTask.execute(imageParams).then(res => {
        console.warn(res)
      })
    })
  }
  /**
   * 镶嵌数据集探针
   * @param {Array} Colormap 色标数组
   * @param {Array} labelArray 标注数组
   * @param {String} pixLabel 标题
   * @param {String} canvasId canvas的ID
   * @param {String} unit 单位
   */
  drawMosaicLegend(Colormap, labelArray, pixLabel, canvasId, unit) {
    let dataObj = []
    Colormap.forEach((element, index) => {
      let colorString = []
      element.forEach((item, index) => {
        if (index !== 0) {
          colorString.push(item)
        }
      })
      let levelName = labelArray[index]
      let obj = {
        tname: levelName,
        color: `rgb(${colorString[0]},${colorString[1]},${colorString[2]})`
      }
      dataObj.push(obj)
    })
    let canvas = document.getElementById(canvasId)
    var ctx = canvas.getContext('2d')
    let widthArray = []
    for (var i = 0; i < dataObj.length; i++) {
      let txt = dataObj[i].tname
      widthArray.push(ctx.measureText(txt).width)
    }
    var yheight = 30
    yheight += dataObj.length * 27 // 计算canvas高度
    canvas.width = 100
    canvas.height = yheight

    /* 设置图例样式 */
    ctx.fillStyle = 'rgba(248, 251, 255, 0.2)'
    ctx.fillRect(0, 0, 200, yheight) // 绘制底图
    ctx.font = '16px Arial'
    ctx.fillStyle = '#000'
    let str = pixLabel + '(' + unit + ')'
    let startWidth = (canvas.width - ctx.measureText(str).width) / 2
    ctx.fillText(str, startWidth, 20)

    document.querySelector(`#${canvasId}`).style.display = 'block'

    for (let i = 0; i < dataObj.length; i++) {
      // 实现文字前面带色块
      ctx.fillStyle = dataObj[i].color // 块颜色
      // 实现色块的边框
      ctx.moveTo(10, 60 + (i - 1) * 25)
      ctx.lineTo(10 + 25, 60 + (i - 1) * 25)
      ctx.lineTo(10 + 25, 60 + (i - 1) * 25 + 15)
      ctx.lineTo(10, 60 + (i - 1) * 25 + 15)
      ctx.closePath()
      ctx.lineWidth = 1
      ctx.strokeStyle = '#8C7A58'
      ctx.strokeRect = '#8C7A58'
      ctx.stroke()
      ctx.fillRect(10, 60 + (i - 1) * 25, 25, 15) // 颜色块：x,y,w,h
      ctx.font = '12px Arial'
      ctx.fillStyle = '#555'
      let txt = dataObj[i].tname
      ctx.fillText(txt, 40, 72 + (i - 1) * 25) // 文字
    }
  }
  /**
   * 绘制点图层
   * @param {String} layerId 图层id
   * @param {Array} points 点数据集合
   * @param {String} lon 数据经度键名
   * @param {String} lat 数据纬度键名
   * @param {String} icon 图标
   * @param {String} iconWidth 图标宽度
   * @param {String} iconHeight 图标高度
   */
  addImageGraphicLayer(
    layerId,
    points,
    lon = 'x',
    lat = 'y',
    icon,
    iconWidth = 12,
    iconHeight = 10
  ) {
    let pointLayer = this.queryLayers(layerId)
    if (pointLayer) {
      pointLayer.clear()
    } else {
      pointLayer = new this.GraphicsLayer({
        id: layerId
      })
      this.newMap.addLayer(pointLayer)
    }
    let spatialReference = new this.SpatialReference({ wkid: 4326 })
    let symbol = {
      url: icon,
      height: iconHeight,
      width: iconWidth,
      type: 'esriPMS'
    }
    points.forEach(item => {
      let point = new this.Point(item[lon], item[lat], spatialReference)
      let graphic = new this.Graphic({
        geometry: point,
        symbol: symbol,
        infoTemplate: {
          title: '',
          content: item.popContent
        }
      })
      pointLayer.add(graphic)
    })
  }
  /**
   * 绘制格网图层
   * @param {String} layerName 图层id
   * @param {Array} firesInfo 格点数据集合
   * @param {String} distance 格点半径（度）
   */
  addGridGraphicLayer(layerName, firesInfo = [], distance) {
    // 根据处理的格点中心经纬度以及value值绘制格点图层和label图层
    let gridLayer = this.queryLayers(layerName)
    let gridLabelLayer = this.queryLayers(`${layerName}Label`)
    let spatialReference = new this.SpatialReference({ wkid: 4326 })
    if (gridLayer) {
      this.newMap.removeLayer(gridLayer)
      this.newMap.removeLayer(gridLabelLayer)
    }
    // 格点图层
    gridLayer = new this.GraphicsLayer({
      id: layerName
    })
    // 标注图层
    gridLabelLayer = new this.GraphicsLayer({
      id: `${layerName}Label`,
      minScale: 200000
    })
    this.newMap.addLayer(gridLayer)
    this.newMap.addLayer(gridLabelLayer, 10)
    firesInfo.forEach(item => {
      // value不为0值绘制
      if (item[2] !== 0) {
        let maxx = Number(item[0] + distance)
        let mimx = Number(item[0] - distance)
        let maxy = Number(item[1] + distance)
        let miny = Number(item[1] - distance)
        let extent = new this.Extent(mimx, miny, maxx, maxy, spatialReference)
        let textPoint = new this.Point({
          x: Number(item[0]),
          y: Number(item[1]),
          spatialReference: spatialReference
        })
        // 获取格点颜色
        let gridColor = getColor(item[2])
        let gridSymbol = {
          color: new this.Color(gridColor),
          outline: {
            color: new this.Color([202, 202, 202, 0.5]),
            width: 0.5,
            type: 'esriSLS',
            style: 'esriSLSSolid'
          },
          type: 'esriSFS',
          style: 'esriSFSSolid'
        }
        let labelSymbol = {
          color: [183, 183, 183, 255],
          font: { size: 15, style: 'normal', weight: 'bold', family: 'serif' },
          horizontalAlignment: 'center',
          kerning: true,
          rotated: false,
          text: item[2],
          type: 'esriTS',
          yoffset: -5
        }
        let gridGraphic = new this.Graphic({
          geometry: extent,
          symbol: gridSymbol
        })
        let textGraphic = new this.Graphic({
          geometry: textPoint,
          symbol: labelSymbol
        })
        gridLayer.add(gridGraphic)
        gridLabelLayer.add(textGraphic)
      }
    })
    console.warn(this.newMap)
  }
  /**
   * 绘制网格图层
   * @param {String} initParams 参数
   * @param {Array} dataArray 数据
   * @param {mapFlag} mapFlag 是否初始化
   */
  drawRasterGridLayer(initParams, dataArray) {
    let _this = this
    this.rasterGridParams = {
      initParams: initParams,
      dataArray: dataArray
    }
    const step = initParams.step // 分辨率步长
    const spatialReference = new this.SpatialReference({ wkid: 4326 }) // 坐标系

    // 数据区extent
    const dataExtent = new this.Extent(
      initParams.minx,
      initParams.miny,
      initParams.maxx,
      initParams.maxy,
      spatialReference
    )
    this.initDataExtent = dataExtent
    // 地图可视范围extent
    let mapExtent = this.newMap.spatialReference.isWebMercator()
      ? this.WebMercatorUtils.webMercatorToGeographic(this.newMap.extent)
      : this.newMap.extent
    // 两个geometry是否相交
    let isInsert = this.geometryEngine.within(mapExtent, dataExtent)
    let isInsert2 = this.geometryEngine.overlaps(dataExtent, mapExtent)

    let canvasSize = calculateCanvasSize(isInsert, isInsert2)
    function calculateCanvasSize(flag, flag2) {
      let result = {}
      if (flag || flag2) {
        // 计算交集
        let intersectGeometry = _this.geometryEngine.intersect(
          dataExtent,
          mapExtent
        )
        // 计算交集的宽高
        let mapwidth = _this.newMap.width
        let mapHeight = _this.newMap.height
        let intersectWidth = Math.floor(
          (mapwidth * (intersectGeometry.xmax - intersectGeometry.xmin)) /
          (mapExtent.xmax - mapExtent.xmin)
        )
        let intersectHeight = Math.floor(
          (mapHeight * (intersectGeometry.ymax - intersectGeometry.ymin)) /
          (mapExtent.ymax - mapExtent.ymin)
        )
        result = {
          width: intersectWidth,
          height: intersectHeight,
          geometry: intersectGeometry
        }
      } else {
        let minPoint = new _this.Point(initParams.minx, initParams.miny, spatialReference)
        let maxPoint = new _this.Point(initParams.maxx, initParams.maxy, spatialReference)
        let minScreen = _this.newMap.toScreen(minPoint)
        let maxScreen = _this.newMap.toScreen(maxPoint)
        let width = Math.abs(maxScreen.x - minScreen.x)
        let height = Math.abs(minScreen.y - maxScreen.y)
        result = {
          width: width,
          height: height,
          geometry: dataExtent
        }
      }
      return result
    }
    this.drawCanvasImage(
      canvasSize.width,
      canvasSize.height,
      canvasSize.geometry,
      initParams,
      dataArray,
      step
    )
  }
  /**
   * 绘制canvase格网图层
   * @param {Number} width canvas宽度
   * @param {Number} height canvas 高度
   * @param {Object} intersectGeometry 相交的geometry
   * @param {Object} initParams 初始化参数
   * @param {Array} dataArray 数据
   */
  drawCanvasImage(width, height, intersectGeometry, initParams, dataArray) {
    let canvasImg = document.createElement('canvas')
    let ctx2d = canvasImg.getContext('2d')
    canvasImg.width = width
    canvasImg.height = height
    let imageData = ctx2d.getImageData(0, 0, width, height)
    let data = imageData.data
    for (let j = 0; j < height; j++) {
      // j 高度 纬度
      for (let i = 0; i < width; i++) {
        // i 宽度 经度
        let lon =
          (i * (intersectGeometry.xmax - intersectGeometry.xmin) +
            intersectGeometry.xmin * width) /
          width
        let lat =
          ((height - j) * (intersectGeometry.ymax - intersectGeometry.ymin) +
            intersectGeometry.ymin * height) /
          height
        // data.push([lon, lat])
        let k = Math.floor((lon - initParams.minx) / initParams.step) // 经度 列 宽
        let n = Math.floor((lat - initParams.miny) / initParams.step) // 纬度 行 高

        let corData = dataArray[n][k]
        // ctx2d.fillRect(j, i, 1, 1)
        if (corData !== 0) {
          // ctx2d.moveTo(j, i)
          ctx2d.fillRect(j, i, 1, 1)
          data[j * 4 * width + 4 * i + 0] = 62
          data[j * 4 * width + 4 * i + 1] = 179
          data[j * 4 * width + 4 * i + 2] = 34
          data[j * 4 * width + 4 * i + 3] = 255
        } else {
          // ctx2d.moveTo(j, i)
          ctx2d.fillRect(j, i, 1, 1)
          data[j * 4 * width + 4 * i + 0] = 0
          data[j * 4 * width + 4 * i + 1] = 0
          data[j * 4 * width + 4 * i + 2] = 0
          data[j * 4 * width + 4 * i + 3] = 50
        }
      }
    }
    ctx2d.putImageData(imageData, 0, 0)
    let canvasUrl = canvasImg.toDataURL('image/png')

    this.addPicRange(
      'rasterGridLayer',
      canvasUrl,
      [[intersectGeometry.xmax, intersectGeometry.ymax], [intersectGeometry.xmin, intersectGeometry.ymin]]
    )
  }
  /**
   * 编辑网格数据(像素点比较)
   * @param {Array} geometrys 编辑的图形
   * @param {Number} value 修改后的值
   * @param {object} gridParams 格网初始化参数
   * @param {Array} dataArray 编辑的二维数组
   */
  editRasterGridData(geometrys, value = 'VALUE', gridParams, dataArray) {
    const spatialReference = new this.SpatialReference({ wkid: 4326 }) // 坐标系
    let dataArrayModify = dataArray
    geometrys.forEach(item => {
      let insertGeomerty = this.geometryEngine.intersect(item, this.initDataExtent)
      let intersectGeometry = insertGeomerty.getExtent()
      const xmin = intersectGeometry.xmin
      const xmax = intersectGeometry.xmax
      const ymin = intersectGeometry.ymin
      const ymax = intersectGeometry.ymax
      const minlonIndex = Math.floor((xmin - gridParams.minx) / gridParams.step)
      const maxlonIndex = Math.floor((xmax - gridParams.minx) / gridParams.step)
      const minlatIndex = Math.floor((ymin - gridParams.miny) / gridParams.step)
      const maxlatIndex = Math.floor((ymax - gridParams.miny) / gridParams.step)
      for (let i = minlatIndex; i <= maxlatIndex; i++) {
        for (let j = minlonIndex; j <= maxlonIndex; j++) {
          let lon = gridParams.minx + j * gridParams.step
          let lat = gridParams.miny + i * gridParams.step
          let point = new this.Point(lon, lat, spatialReference)
          let isInsert = item.contains(point)
          if (isInsert) {
            dataArrayModify[i][j] = Number(value)
          }
        }
      }
    })
    this.drawRasterGridLayer(gridParams, dataArrayModify)
    this.queryLayers('measureGraphicsLayer').clear()
    return dataArrayModify
  }
  /**
   * 绘制热力图
   * @param {Array} points 点的数据体（lon, lat, value）
   * @param {String} layerName 图层名称
   * @param {String} fieldName 渲染字段
   * @param {Number} blurRadius 缓冲区半径
   * @param {Number} maxPixelIntensity 最大识别像素
   * @param {Number} minPixelIntensity 最小识别像素
   */
  drawHeatLayer(points = [], layerName, fieldName, blurRadius = 8, maxPixelIntensity = 100, minPixelIntensity = 0) {
    let features = []
    points.forEach((item, index) => {
      let attribute = {
        FID: index.toString(),
        LON: item.lon.toString(),
        LAT: item.lat.toString(),
        VALUE: item.value
      }
      let graphic = {
        geometry: {
          x: item.lon,
          y: item.lat
        },
        attributes: attribute
      }
      features.push(graphic)
    })
    let fields = [
      {
        name: 'FID',
        type: 'esriFieldTypeOID',
        alias: 'FID'
      },
      {
        name: 'LON',
        type: 'esriFieldTypeString',
        alias: 'LON',
        length: 100
      },
      {
        name: 'LAT',
        type: 'esriFieldTypeString',
        alias: 'LAT',
        length: 100
      },
      {
        name: 'VALUE',
        type: 'esriFieldTypeDouble',
        alias: 'VALUE'
      }
    ]
    var dz = {
      // 数据的基本属性
      displayFieldName: '',
      fieldAliases: {
        FID: 'FID',
        LON: 'LON',
        LAT: 'LAT',
        VALUE: 'VALUE'
      },
      geometryType: 'esriGeometryPoint',
      spatialReference: {
        wkid: 4326,
        latestWkid: 4326
      },
      // 所含有的字段信息
      fields: fields,
      // 所含有的集合要素集
      features: features
    }
    let featureSet = new this.FeatureSet(dz)

    var layerDefinition = {
      geometryType: 'esriGeometryPoint',
      fields: fields
    }
    let featureCollection = {
      layerDefinition: layerDefinition,
      featureSet: featureSet
    }
    var heatmapFeatureLayerOptions = {
      id: layerName,
      mode: this.FeatureLayer.MODE_SNAPSHOT,
      outFields: ['FID', 'VALUE']
      // infoTemplate: infoTemplate
    }
    let heatmapFeatureLayer = new this.FeatureLayer(featureCollection, heatmapFeatureLayerOptions)
    var heatmapRenderer = new this.HeatmapRenderer({
      field: fieldName,
      blurRadius: blurRadius,
      maxPixelIntensity: maxPixelIntensity,
      minPixelIntensity: minPixelIntensity
    })

    heatmapFeatureLayer.setRenderer(heatmapRenderer)
    this.newMap.addLayer(heatmapFeatureLayer)
  }
  /**
   * 地图缩放
   * @param {String} type 缩放类型  zoomIn（放大）  zoomOut（缩小）  zoomRecover（恢复）
   */
  zoomControl(type) {
    let zoomLevel = this.newMap.getZoom()
    if (type === 'zoomIn') {
      this.newMap.setZoom(++zoomLevel)
    } else if (type === 'zoomOut') {
      this.newMap.setZoom(--zoomLevel)
    } else if (type === 'zoomRecover') {
      this.newMap.centerAndZoom(this.initMap.center, this.initMap.zoom)
    }
  }
  /**
   * 框选放大区域
   */
  chooseIn() {
    this.mapDraw.activate(this.draw.EXTENT)
    this.mapDraw.on('draw-end', evt => {
      this.newMap.setExtent(evt.geometry, false)
      this.mapDraw.deactivate()
    })
  }
  /**
   * 测量工具
   * @param {String} type：类型  polyline：线 polygon：面   clear：清除
   */
  measureDist(type) {
    this.measureGraphicsLayer.clear()
    this.popup.hide()
    let _this = this
    // let toolbar = new draw(this.newMap)

    switch (type) {
      case 'polyline':
        this.toolbar.activate(this.draw.POLYLINE)
        break
      case 'polygon':
        this.toolbar.activate(this.draw.POLYGON)
        break
      case 'clear':
        this.toolbar.deactivate()
        return
      default:
        return
    }

    let measuregeometry

    this.toolbar.on('draw-end', function (result) {
      let geometry = result.geometry
      _this.newMap.enableMapNavigation()
      doMeature(geometry)
    })

    function doMeature(geometry) {
      _this.measureGraphicsLayer.clear()
      let symbol
      switch (geometry.type) {
        case 'polyline':
          symbol = new _this.SimpleLineSymbol(
            _this.SimpleLineSymbol.STYLE_SOLID,
            new _this.Color([8, 105, 250]),
            2
          )
          break
        case 'polygon':
          symbol = new _this.SimpleLineSymbol(
            _this.SimpleLineSymbol.STYLE_SOLID,
            new _this.Color([8, 105, 250]),
            2
          )
          break
        default:
          break
      }
      let myGraphic = new _this.Graphic(geometry, symbol)
      _this.measureGraphicsLayer.add(myGraphic)
      measureGeometry(geometry)
    }

    function measureGeometry(geometry) {
      measuregeometry = geometry
      let geometryService = new _this.GeometryService(tdtConfigInfo.geometryServer)
      if (geometry.type === 'polyline') {
        let lengthParams = new _this.LengthsParameters()
        lengthParams.polylines = [geometry]
        lengthParams.lengthUnit = _this.GeometryService.UNIT_KILOMETER
        // lengthParams.geodesic = true;
        lengthParams.calculationType = 'preserveShape'
        geometryService.lengths(lengthParams)
        lengthParams.polylines[0].spatialReference = new _this.SpatialReference(4326)
        geometryService.lengths(lengthParams)
        geometryService.on('lengths-complete', outputDistance)
      } else if (geometry.type === 'polygon') {
        let areasAndLengthParams = new _this.AreasAndLengthsParameters()
        areasAndLengthParams.lengthUnit = _this.GeometryService.UNIT_KILOMETER
        areasAndLengthParams.areaUnit = _this.GeometryService.UNIT_SQUARE_KILOMETERS
        let outSR = new _this.SpatialReference({ wkid: 4326 })
        geometryService.project([geometry], outSR, function (geometry) {
          geometryService.simplify(geometry, function (simplifiedGeometries) {
            areasAndLengthParams.polygons = simplifiedGeometries
            areasAndLengthParams.polygons[0].spatialReference = new _this.SpatialReference(4326)
            geometryService.areasAndLengths(areasAndLengthParams)
          })
        })
        geometryService.on('areas-and-lengths-complete', outputAreaAndLength)
      }
    }

    // 显示距离测量结果
    function outputDistance(result) {
      if (parseInt(String(result.result.lengths[0])) !== 0) {
        let CurX = measuregeometry.paths[0][measuregeometry.paths[0].length - 1][0]
        let CurY = measuregeometry.paths[0][measuregeometry.paths[0].length - 1][1]
        let newPoint = _this.mercator2lonlat({ x: CurX, y: CurY })

        let CurPos = new _this.Point(
          newPoint.x,
          newPoint.y,
          new _this.SpatialReference({ wkid: 4326 })
        )
        _this.popup.setTitle('距离测量')
        _this.popup.setContent(
          ' 测 量 长 度 ： <strong>' + parseInt(String(result.result.lengths[0])) + '</strong>千米'
        )
        _this.popup.show(CurPos)
        // popup.style.display = "block"
      }
    }

    // 显示面积测量结果
    function outputAreaAndLength(result) {
      let pointXY = measuregeometry.rings[0][0]
      // let center = measuregeometry.getCentroid();  //获取查询区域的中心点
      //  let cPoint = new esri.geometry.Point([center.x, center.y], new esri._this.SpatialReference({ wkid: 4326 }));
      let newPoint = _this.mercator2lonlat({ x: pointXY[0], y: pointXY[1] })
      let cPoint = new _this.Point(
        newPoint.x,
        newPoint.y,
        new _this.SpatialReference({ wkid: 4326 })
      )
      _this.popup.setTitle('面积测量')
      _this.popup.setContent(
        ' 面积： <strong>' +
        parseInt(String(result.result.areas[0])) +
        '</strong>平方千米 周长：<strong>' +
        parseInt(String(result.result.lengths[0])) +
        '</strong>千米'
      )
      _this.popup.show(cPoint)
      // popup.style.display="block"
    }
  }
  /**
   * 经纬度转墨卡托
   * @param {Object} lonlat: 转换前经纬度坐标的对象
   */
  lonlat2mercator(lonlat) {
    let mercator = {
      x: 0,
      y: 0
    }
    let x = (lonlat.x * 20037508.34) / 180
    let y = Math.log(Math.tan(((90 + lonlat.y) * Math.PI) / 360)) / (Math.PI / 180)
    y = (y * 20037508.34) / 180
    mercator.x = x
    mercator.y = y
    return mercator
  }

  /**
   * 墨卡托转经纬度
   * @param {Object} lonlat: 转换前墨卡托坐标的对象
   */
  mercator2lonlat(mercator) {
    let lonlat = {
      x: 0,
      y: 0
    }
    let x = (mercator.x / 20037508.34) * 180
    let y = (mercator.y / 20037508.34) * 180
    y = (180 / Math.PI) * (2 * Math.atan(Math.exp((y * Math.PI) / 180)) - Math.PI / 2)
    lonlat.x = x
    lonlat.y = y
    return lonlat
  }
  /**
   * 属性查询
   * @param {String} url 图层路径
   * @param {Bool} returnGeoState 是否返回Geometry
   * @param {String} expression 查询条件
   * @param {Array} outFields outFields：查询字段
   * @param {Function} callback 回调函数
   */
  executeQueryTask(url, expression, outFields, returnGeoState, callback) {
    let queryTask = new this.QueryTask(url)
    let query = new this.Query()
    query.returnGeometry = returnGeoState
    query.outFields = outFields
    query.where = expression
    var p = new Promise((resolve, reject) => {
      queryTask.execute(query, res => {
        resolve(res)
      })
    })
    return p
  }
  /**
   * 空间查询
   * @param {String} url 图层路径
   * @param {Bool} returnGeoState 是否返回Geometry
   * @param {String} expression 查询条件
   * @param {Array} outFields outFields：查询字段
   * @param {Function} callback 回调函数
   */
  excuteQuerySpace(url, geometry, outFields, returnGeoState) {
    let searchGeometry = geometry
    if (geometry.spatialReference.isWebMercator()) {
      searchGeometry = webMercatorUtils.webMercatorToGeographic(geometry)
    }
    let queryTask = new this.QueryTask(url)
    let query = new this.Query()
    query.returnGeometry = returnGeoState
    query.outFields = outFields
    query.geometry = searchGeometry
    let p = new Promise((resolve, reject) => {
      queryTask.execute(query, res => {
        resolve(res)
      })
    })
    return p
  }
  /**
   * 墨卡托转经纬度
   * @param {object} geometry 矢量
   */
  convertMercatorToGeo(geometry) {
    let result = geometry.spatialReference.isWebMercator()
      ? this.WebMercatorUtils.webMercatorToGeographic(geometry)
      : geometry
    return result
  }
  /**
   * 经纬度转墨卡托
   * @param {object} geometry 矢量
   */
  convertGeoToMercator(geometry) {
    let result = geometry.spatialReference.isWebMercator()
      ? geometry
      : this.WebMercatorUtils.geographicToWebMercator(geometry)
    return result
  }
  /**
   * 图层点击事件
   * @param {object} layer 图层
   * @param {string} id 选中的id
   */
  layerClick(layer) {
    layer.on('click', res => {
      console.warn(res)
    })
  }
  /**
   * 地图范围改变事件
   */
  mapExtentChange() {
    var p = new Promise((resolve, reject) => {
      this.newMap.on('extent-change', res => {
        if (Object.keys(this.rasterGridParams).length !== 0) {
          let nextExtent = utils.objectExtractprops(res.extent, ['xmax', 'xmin', 'ymax', 'ymin'])
          let preExtent = utils.objectExtractprops(this.currentExtent, [
            'xmax',
            'xmin',
            'ymax',
            'ymin'
          ])
          if (!utils.ObjectEquals(nextExtent, preExtent) && this.queryLayers('rasterGridLayer')) {
            this.drawRasterGridLayer(this.rasterGridParams.initParams, this.rasterGridParams.dataArray, true)
            resolve(res)
          }
        }
        this.currentExtent = res.extent
      })
    })
    return p
  }
  /**
   * 地图点击事件
   * @param {String} layerName 图层id
   */
  mapClick(callback) {
    this.newMap.on('click', evt => {
      let data = {
        evt
      }
      if (callback) {
        callback(data)
      }
    })
  }
}
