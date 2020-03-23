export const arcgisApiAddress = 'http://localhost/arcgis_js_api/library/3.26/3.26/init.js'

// 天地图离线数据
export const tdtConfigInfo = {
  roadLayer: 'http://localhost/imgS/tdt/map/${level}/${row}/${row}_${col}.png', // 交通图
  stLayer: 'http://localhost/imgS/tdt/img/${level}/${row}/${row}_${col}.png', // 影像图
  labelLayer: 'http://localhost/imgS/tdt/tit/${level}/${row}/${row}_${col}.png', // 影像标注
  // geometryServer:
  //   'http://192.168.1.182:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer', // 测量服务

  tileInfo: {
    rows: 256,
    cols: 256,
    compressionQuality: 0,
    origin: {
      x: -180,
      y: 90
    },
    spatialReference: {
      wkid: 4326
    },
    lods: [
      {
        level: 0,
        resolution: 0.703125,
        scale: 295497593.05875
      },
      {
        level: 1,
        resolution: 0.3515625,
        scale: 147748796.529375
      },
      {
        level: 2,
        resolution: 0.17578125,
        scale: 73874398.264688
      },
      {
        level: 3,
        resolution: 0.087890625,
        scale: 36937199.132344
      },
      {
        level: 4,
        resolution: 0.0439453125,
        scale: 18468599.566172
      },
      {
        level: 5,
        resolution: 0.02197265625,
        scale: 9234299.783086
      },
      {
        level: 6,
        resolution: 0.010986328125,
        scale: 4617149.891543
      },
      {
        level: 7,
        resolution: 0.0054931640625,
        scale: 2308574.945771
      },
      {
        level: 8,
        resolution: 0.00274658203125,
        scale: 1154287.472886
      },
      {
        level: 9,
        resolution: 0.001373291015625,
        scale: 577143.736443
      },
      {
        level: 10,
        resolution: 0.0006866455078125,
        scale: 288571.86822143558
      },
      {
        level: 11,
        resolution: 0.00034332275390625,
        scale: 144285.93411071779
      },
      {
        level: 12,
        resolution: 0.000171661376953125,
        scale: 72142.967055358895
      },
      {
        level: 13,
        resolution: 8.58306884765625e-5,
        scale: 36071.483527679447
      },
      {
        level: 14,
        resolution: 4.291534423828125e-5,
        scale: 18035.741763839724
      },
      {
        level: 15,
        resolution: 2.1457672119140625e-5,
        scale: 9017.8708819198619
      },
      {
        level: 16,
        resolution: 1.0728836059570313e-5,
        scale: 4508.9354409599309
      },
      {
        level: 17,
        resolution: 5.3644180297851563e-6,
        scale: 2254.4677204799655
      }
    ]
  }
}
// 切片底图服务
export const tiledMapService = {
  terrain: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer',
  street: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer',
  satellite: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
}
// 图层数据
export const layesConfig = [
  {
    name: 'lineFeather',
    value: 'http://192.168.1.111:6080/arcgis/rest/services/DBZQ/formatLine/MapServer/4',
    expression: `PRODUCTID = '201812262000-003-500-AT'`
  },
  {
    name: 'fillFeature',
    value: 'http://192.168.1.111:6080/arcgis/rest/services/DBZQ/landFill/FeatureServer/0',
    expression: `PRODUCTID='8f3e9c5a-839b-4832-a505-4d017fe9d18d'`,
    valueArray: ['980.0', '985.0', '990.0', '995.0', '1000.0', '1005.0', '1010.0']
  },
  {
    name: 'commonFeature',
    value:
      'http://lstweb.jsweather.com.cn:6080/arcgis/rest/services/Lst_JiangSu/JiangSuBord' +
      'er/MapServer/1'
  },
  {
    name: 'commonDynamic',
    value:
      'http://lstweb.jsweather.com.cn:6080/arcgis/rest/services/Lst_JiangSu/JiangSuBord' +
      'er/MapServer'
  },
  {
    name: 'mosaicDataSet',
    value: 'http://lstweb.jsweather.com.cn:6080/arcgis/rest/services/LST/ImageServer'
    // 'http://192.168.1.182:6080/arcgis/rest/services/Hunan/RAIN/ImageServer'
  }
]
