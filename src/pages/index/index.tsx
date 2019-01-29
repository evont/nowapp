import Taro, { Component, Config } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Text } from '@tarojs/components'
import dayJs from 'dayjs'
import suncalc from '../../util/suncalc'
import DateUtil from '../../util/date'
import Calendar from '../../components/calendar'

import Poem from './poem'
import Enclave from './enclave'
import Totheend from './totheend'
import Phase from './phase'

import './index.scss'



interface IState {
  isLoading: boolean,
  textureWidth: number,
  phaseStyle: string,
  uTime: any,
  barHeight: number,
  phase: any,
  isSliderup: boolean,
  current: number,
}

class Index extends Component<{}, IState> {
  config: Config = {
    navigationStyle: 'custom',
    backgroundColor: '#333',
  }
  state = {
    isLoading: false,
    textureWidth: 0,
    phaseStyle: '',
    uTime: dayJs(),
    barHeight: 0,
    phase: {
      phase: 0,
      phaseName: '',
    },
    current: 0,
    isSliderup: false,
    navList: ['搜韵', '飞地', '观止'],
  }

  async componentDidMount() {
    const { uTime } = this.state;
    const phase = suncalc.getMoonIllumination(new Date(uTime.$y, uTime.$M, uTime.$D));
    const barHeight = await this.refs.calendar.getBarHeight()
    this.setState({
      barHeight,
      phase,
    })
  }
  handleDate(param) {
    const newPhase = suncalc.getMoonIllumination(new Date(param.$y, param.$M, param.$D))
    this.setState({
      uTime: param,
      phase: newPhase,
    })
  }
  toggleSlider = () => {
    const { isSliderup } = this.state
    this.setState({
      isSliderup: !isSliderup,
    })
  }

  swiperChange = (e) => {
    const { current } = e.detail;
    this.setState({
      current,
    })
  }

  toggleSwiper(ind) {
    this.setState({
      current: ind,
    })
  }
  render () {
    const sys = Taro.getSystemInfoSync()
    const { phase, uTime, barHeight, isSliderup, navList, current } = this.state;
    // const phaseStyle = getPhaseStyle(phase.phase, textureWidth)
    const lunar = DateUtil.solar2lunar(uTime.year(), uTime.month() + 1, uTime.date());

    const now = new Date(uTime.$y, uTime.$M, uTime.$D);
    const year = new Date().getFullYear();
    const yearDayCount = year % 4 ? 365 : 366;
    const days = Math.round((now.getTime() - new Date(`${year}/01/01`).getTime()) / ( 24 * 60 * 60 * 1000));
    return (
      <View className='home'>
        <Calendar ref='calendar' headerText={ `${lunar.monthAlias} · ${lunar.Term}`} onHandleDate={ this.handleDate }  />
        <View className='home-body' style={ `margin-top: ${ barHeight }px; height: ${sys.screenHeight - barHeight}px` }>
          <Phase lunar={lunar} phase={phase} uTime={uTime} />
          <View className={ `slider ${isSliderup ? 'slider_active' : ''}` } >
            <View className='slider-head' onClick={ this.toggleSlider }>
              <Text className='title'>发现</Text>
              <Text className='percent'>今年进度：{ (days / yearDayCount * 100).toFixed(2) }%</Text>
            </View>
            <View className='slider-nav'>
              <View className='slider-nav-contain'>
                {
                  navList.map((ele, ind) => ( <Text className={ `title ${ ind === current ? 'title_active' : ''}` } onClick={this.toggleSwiper.bind(this, ind) } key={ ele }>{ ele }</Text> ))
                }
              </View>
              <View className='slider-nav-indicator' style={ `transform: translateX(${current * 100}%)` }>
                <View className='indicator'></View>
              </View>
            </View>
            <Swiper onChange={ this.swiperChange } className='slider-swiper' current={ current }>
                <SwiperItem>
                  <View className='slider-swiper-contain'>
                    <Poem />
                  </View>
                </SwiperItem>
                <SwiperItem>
                  <View className='slider-swiper-contain'>
                    <Enclave />
                  </View>
                </SwiperItem>
                <SwiperItem>
                  <View className='slider-swiper-contain'>
                    <Totheend />
                  </View>
                </SwiperItem>
            </Swiper>
          </View>
        </View>
      </View>
    )
  }
}

export default Index;
