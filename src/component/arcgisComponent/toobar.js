import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Menu, Dropdown, Icon } from 'antd'
import { DownOutlined } from '@ant-design/icons';

@connect(
  state => ({
    arcgisMapReducer: state.arcgisMapReducer
  }), {

}
)
class ToolBar extends Component {
  constructor(props) {
    super(props)
    this.mapMenu = (
      <Menu onClick={this.switchMap}>
        <Menu.Item key="st">影像图</Menu.Item>
        <Menu.Item key="terrain">地形图</Menu.Item>
        <Menu.Item key="road">地图</Menu.Item>
      </Menu>
    )
    this.measureMenu = (
      <Menu onClick={this.measure} className="layerClass">
        <Menu.Item key="polyline">测量距离</Menu.Item>
        <Menu.Item key="polygon">测量面积</Menu.Item>
        <Menu.Item key="clear">清除</Menu.Item>
      </Menu>
    )
    this.state = {
      mapType: '地图'
    }
  }
  // 切换地图
  switchMap = e => {
    const { arcgisViewer } = this.props.arcgisMapReducer
    this.setState(
      {
        mapType: e.item.props.children
      },
      () => {
        arcgisViewer.switchBasemap(e.key)
      }
    )
  }

  // 测量
  measure = e => {
    const { arcgisViewer } = this.props.arcgisMapReducer
    console.log(e);
    arcgisViewer.measureDist(e.key)
  }
  componentDidMount() {
    const ULDom = document.querySelector('.toolbar-list')
    ULDom.addEventListener('click', e => {
      const { arcgisViewer } = this.props.arcgisMapReducer
      if (e.target.parentNode.textContent === '放大' || e.target.textContent === '放大') {
        arcgisViewer.zoomControl('zoomIn')
      }
      if (e.target.parentNode.textContent === '缩小' || e.target.textContent === '缩小') {
        arcgisViewer.zoomControl('zoomOut')
      }
      if (e.target.parentNode.textContent === '恢复' || e.target.textContent === '恢复') {
        arcgisViewer.zoomControl('zoomRecover')
      }
      // 框选方法  框选放大
      if (e.target.parentNode.textContent === '框选放大' || e.target.textContent === '框选放大') {
        // this.props.mapView.chooseIn()
      }
    })
  }
  render() {
    return (
      <div className='tool-bar'>
        <ul className="toolbar-list">
          <li className='fangda'>
            <span className="icon iconfont icon-fangda" />
            &nbsp;
            <span>放大</span>
          </li>
          <li className='suoxiao'>
            <span className="icon iconfont icon-suoxiao" />
            &nbsp;
            <span>缩小</span>
          </li>
          <li className='huifu'>
            <span className="icon iconfont icon-huifu" />
            &nbsp;
            <span>恢复</span>
          </li>
          <li>
            <span className="icon iconfont icon-tubiaozhizuomoban-" />
            &nbsp;
            <Dropdown overlay={this.mapMenu} trigger={['click']}>
              <span className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                {this.state.mapType}<DownOutlined />
              </span>
            </Dropdown>
          </li>
          <li>
            <span className="icon iconfont icon-kuangxuanfangda" />
            &nbsp;
            <span>框选放大</span>
          </li>
          <li className="rangingLi" title="测距">
            <span className="icon iconfont icon-ceju" />
            &nbsp;
            <Dropdown overlay={this.measureMenu} trigger={['click']}>
              <span className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                测量工具<DownOutlined />
              </span>
            </Dropdown>
          </li>
        </ul>
      </div>
    )
  }
}
export default ToolBar