import esriLoader from 'esri-loader'
import ArcgisApp from '../../utils/arcgisTools/arcgisApp'
import { arcgisApiAddress } from '../../config/arcgis_config/mapConfig'

const ARCGIS_MAP = 'ARCGIS_MAP'

const initState = {
  arcgisViewer: {}
}
export function arcgisMapReducer(state = initState, action) {
  console.log(state);
  console.log(action);
  switch (action.type) {
    case ARCGIS_MAP:
      return Object.assign({}, state, {
        arcgisViewer: action.data
      })
    default:
      return state
  }
}

// 初始化地图
export function initArcgisMap(mapId) {
  return dispatch => {
    const mapOption = {
      url: arcgisApiAddress
    }
    esriLoader.loadModules(
      [
        'esri/map',
        'esri/layers/gaodeLayer',
        'esri/layers/googleLayer',
        'esri/layers/FeatureLayer',
        'esri/layers/GraphicsLayer',
        'esri/layers/ArcGISTiledMapServiceLayer',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/layers/WMSLayer',
        'esri/layers/WMSLayerInfo',
        'esri/layers/MapImageLayer',
        'esri/layers/MapImage',
        'esri/SpatialReference',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/tasks/QueryTask',
        'esri/tasks/query',
        'esri/layers/LabelClass',
        'esri/symbols/Font',
        'esri/Color',
        'esri/renderers/UniqueValueRenderer',
        'esri/symbols/TextSymbol',
        'esri/layers/ArcGISImageServiceLayer',
        'esri/layers/RasterFunction',
        'esri/tasks/IdentifyTask',
        'esri/tasks/IdentifyParameters',
        'esri/layers/ImageServiceParameters',
        'esri/tasks/ImageServiceIdentifyTask',
        'esri/tasks/ImageServiceIdentifyParameters',
        'esri/layers/WebTiledLayer',
        'esri/layers/TileInfo',
        'esri/toolbars/draw',
        'esri/dijit/Popup',
        'dojo/dom-construct',
        'esri/graphic',
        'esri/geometry/Point',
        'esri/geometry/Polyline',
        'esri/geometry/Polygon',
        'esri/tasks/GeometryService',
        'esri/tasks/LengthsParameters',
        'esri/tasks/AreasAndLengthsParameters',
        'esri/dijit/PopupTemplate',
        'widgets/FlareClusterLayer_v3',
        'esri/renderers/ClassBreaksRenderer',
        'esri/geometry/Extent',
        'esri/geometry/ScreenPoint',
        'esri/layers/MosaicRule',
        'esri/geometry/webMercatorUtils',
        'esri/geometry/geometryEngine',
        'esri/tasks/FeatureSet',
        'esri/renderers/HeatmapRenderer',
        'esri/config'
      ],
      mapOption
    ).then(
      ([
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
        HeatmapRenderer,
        esriConfig
      ]) => {
        // esriConfig.defaults.io.proxyUrl = 'http://localhost/EsriSample/proxy.ashx'
        // esriConfig.defaults.io.alwaysUseProxy = true
        let initMap = {
          domID: mapId,
          center: [112, 32],
          zoom: 4,
          baseMapType: 'tiled',
          mapType: ['road']
        }
        let mapControl = new ArcgisApp(
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
        )
        console.log(mapControl)
        dispatch({ type: ARCGIS_MAP, data: mapControl })
      }
    ).catch(err => {
      console.log(err);
    })
  }
}