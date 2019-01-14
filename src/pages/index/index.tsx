import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import api from '../../util/api'

import './index.scss'
import moonPng from '../../assets/moon.png'


interface IState {
  loading: boolean,
  lunar: object,
  textureWidth: number,
  phaseStyle: string,
}

class Index extends Component<{}, IState> {

  config: Config = {
    navigationStyle: 'custom',
  }

  state = {
    loading: true,
    textureWidth: 0,
    phaseStyle: '',
    lunar: {
      IMonthCn: '',
      IDayCn: '',
      Term: '',
      phase: {
        phase: 0,
      }
    },
  }
  async componentDidMount() {
    Taro.request({
      url: api.getURL(api.APIMAP.HOME)
    }).then(res => {
      const { data } = res;
      this.setState({
        lunar: data,
        loading: false,
      })
      this.getPhaseStyle()
    })
  }

  getPhaseStyle() {
    const query = Taro.createSelectorQuery()
    query.select('#texture').boundingClientRect(rect => {
      const { lunar } = this.state
      const { phase } = lunar.phase
      const allWidth = rect.width / 2
      let phaseStyle = ''
      const shadowColor = 'rgba(0, 0, 0, .7)'
      const lightColor = '#fff'
      console.log(phase, rect.width)
      if (phase <= 0.25) {
          phaseStyle = `border-right: ${phase / 0.25 * allWidth}px solid ${lightColor};background-color: ${shadowColor}`
      } else if (phase <= 0.5) {
          phaseStyle = `border-right: ${(0.5 - phase) / 0.25 * allWidth}px solid ${lightColor}; border-left: ${(0.5 - phase) / 0.25 * allWidth}px solid ${shadowColor}; background-color: ${lightColor}`
      } else if (phase <= 0.75)  {
          phaseStyle = `border-right: ${(phase - 0.5) / 0.25 * allWidth}px solid ${shadowColor}; border-left: ${(phase - 0.5) / 0.25 * allWidth}px solid ${lightColor}; background-color: ${lightColor}`
      } else if (phase <= 1) {
          phaseStyle = `border-left: ${(1 - phase) / 0.25 * allWidth}px solid ${lightColor};background-color: ${shadowColor}`
      }
      this.setState({
        phaseStyle,
      })
    }).exec()
  }
  render () {
    const now = new Date()
    const year = now.getFullYear()
    const yearDayCount = year % 4 ? 365 : 366;
    const days =  Math.round((now.getTime() - new Date(`${year}/01/01`).getTime()) / ( 24 * 60 * 60 * 1000));
    const { phaseStyle } = this.state;
    return (
      <View className='home'>
        <View className='moon'>
          <View className='moon-wrapper'>
            <Image src={moonPng} className='moon-texture' id='texture'/>
            <View className='moon-phase' style={phaseStyle}></View>
          </View>
        </View>
      </View>
    )
  }
}

export default Index;
