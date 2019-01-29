import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import getPhaseStyle from '../../../util/phase'
import dayJs from 'dayjs'

import './index.scss'
import moonPng from '../../../assets/moon.png'

interface IProps {
  lunar: any,
  phase: any,
  uTime: any
}

class Index extends Component<IProps, {}> {
  static defaultProps = {
    lunar: {
      cYear: 1919,
      cMonth: 1, 
      cDay: 1, 
      IMonthCn: '一月', 
      IDayCn: '初一',
      ncWeek: '何曜日', 
    },
    phase: {},
    uTime: {},
  }
  state = {
    textureWidth: 0,
  }
  componentDidMount() {
    const query = Taro.createSelectorQuery().in(this.$scope)
    query.select('#texture').boundingClientRect((rect:any) => {
      if (rect) {
        const textureWidth = rect.width / 2
        this.setState({
          textureWidth,
        })
      }
    }).exec()
  }
  render () {
    const { textureWidth } = this.state
    const { lunar, phase, uTime } = this.props
    const now = new Date(uTime.$y, uTime.$M, uTime.$D);
    const newDay = dayJs(now)
    const phaseStyle = getPhaseStyle(phase.phase, textureWidth)
    const { cYear, ncWeek, cMonth, cDay, IMonthCn, IDayCn } = lunar
    const { phaseName } = phase
    return (
      <View className='comp'>
        <View className='day'>
          <View className='day-top'>
            <View className='day-top-left'>
              <Text className='year'>{ cYear }</Text>
            </View>
            <View className='day-top-right'>
              <Text className='week'>{ ncWeek }</Text>
              <Text className='date'>{ newDay.format && newDay.format('ddd MMM') }</Text>
            </View>
          </View>
          <View className='day-sep'></View>
          <View className='day-bottom'>
            <Text className='phase'>{ phaseName }</Text>
            <View className='info'><Text className='info-cdate'>{ `${cMonth}.${cDay}` }</Text> / <Text className='info-ldate'>{ `${IMonthCn}${IDayCn}` }</Text></View>
          </View>
        </View>
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
