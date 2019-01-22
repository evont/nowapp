import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import dayJs from 'dayjs'
import suncalc from '../../util/suncalc'
import DateUtil from '../../util/date'
import Calendar from '../../components/calendar'

import './index.scss'
import moonPng from '../../assets/moon.png'


interface IState {
  isLoading: boolean,
  lunar: object,
  textureWidth: number,
  phaseStyle: string,
  time: any,
  barHeight: number,
  phase: any,
}

class Index extends Component {
  config: Config = {
    navigationStyle: 'custom',
    backgroundColor: '#333',
  }
  state = {
    isLoading: false,
    textureWidth: 0,
    phaseStyle: '',
    time: dayJs(),
    barHeight: 0,
    lunar: {
      cDay: 1,
      cMonth: 1,
      IMonthCn: '',
      IDayCn: '',
      Term: '',
      monthAlias: '',
      ncWeek: '',
    },
    phase: {
      phase: 0,
      phaseName: '',
    }
  }

  async componentDidMount() {
    const { time } = this.state;
    const phase = suncalc.getMoonIllumination(new Date(time.$y, time.$M, time.$D));
    const barHeight = await this.refs.calendar.getBarHeight()
    this.setState({
      barHeight,
      phase,
    })
    const query = Taro.createSelectorQuery()
    query.select('#texture').boundingClientRect(rect => {
      if (rect) {
        const textureWidth = rect.width / 2
        this.setState({
          textureWidth,
        })
      }
    }).exec()
  }
  getPhaseStyle(phase, allWidth) {
    let phaseStyle = ''
    const shadowColor = 'rgba(0, 0, 0, .7)'
    const lightColor = 'rgba(255, 255, 255, .5)'
    if (phase <= 0.25) {
      phaseStyle = `border-right: ${phase / 0.25 * allWidth}px solid ${lightColor};background-color: ${shadowColor}`
    } else if (phase <= 0.5) {
      phaseStyle = `border-left: ${(0.5 - phase) / 0.25 * allWidth}px solid ${shadowColor}; background-color: ${lightColor}`
    } else if (phase <= 0.75)  {
      phaseStyle = `border-right: ${(phase - 0.5) / 0.25 * allWidth}px solid ${shadowColor};  background-color: ${lightColor}`
    } else if (phase <= 1) {
      phaseStyle = `border-left: ${(1 - phase) / 0.25 * allWidth}px solid ${lightColor};background-color: ${shadowColor}`
    }
    return phaseStyle;
  }
  handleDate(param) {
    const newPhase = suncalc.getMoonIllumination(new Date(param.$y, param.$M, param.$D))
    this.setState({
      time: param,
      phase: newPhase,
    })
  }
  render () {
    const { textureWidth, phase, time } = this.state;
    const phaseStyle = this.getPhaseStyle(phase.phase, textureWidth)
    const lunar = DateUtil.solar2lunar(time.year(), time.month() + 1, time.date());
    return (
      <View className='home'>
        <Calendar ref='calendar' onHandleDate={ this.handleDate }  />
        <View className='home-body' style={ `margin-top: ${this.state.barHeight}px` }>
          <View className='moon'>
            <View className='moon-wrapper'>
              <Image src={moonPng} className='moon-texture' id='texture'/>
              <View className='moon-phase' style={phaseStyle}></View>
            </View>
            <Text className='moon-name'>{ phase.phaseName }</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default Index;
