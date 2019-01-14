import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import api from '../../util/api'

import './index.scss'
import moonPng from '../../assets/moon.png'
import { number } from 'prop-types';


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
      cDay: 1,
      cMonth: 1,
      IMonthCn: '',
      IDayCn: '',
      Term: '',
      moonAlias: '',
      ncWeek: '',
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
    const { phaseStyle, lunar } = this.state;
    return (
      <View className='home'>
        <View className='date'>
          <View className='date-left'>
            <Text className='date-iMonth'>{ lunar.moonAlias } / { lunar.Term }</Text>
            <Text className='date-iDate'>{ lunar.IMonthCn }{ lunar.IDayCn }</Text>
          </View>
          <View className='date-right'>
            <Text className='date-cDate'>{ lunar.cMonth }月{ lunar.cDay }日</Text>
            <Text className='date-week'>{ lunar.ncWeek }</Text>
          </View>
        </View>
        <View className='moon'>
          <View className='moon-wrapper'>
            <Image src={moonPng} className='moon-texture' id='texture'/>
            <View className='moon-phase' style={phaseStyle}></View>
          </View>
        </View>
        <View className='percent'>
          <Text className='percent-number'>{ (days / yearDayCount * 100).toFixed(2) }</Text>
          <Text className='percent-unit'>%</Text>
        </View>
      </View>
    )
  }
}

export default Index;
