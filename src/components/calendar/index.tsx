import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import dayJs from 'dayjs'
import './index.scss'
import DateUtil from '../../util/date'
export default class Calendar extends Component {
  state = {
    time: dayJs(),
    today: dayJs(),
    calendar: [],
    month: 1,
    year: 1990,
  }
  componentDidMount() {
    const now = dayJs();
    this.setState({
      time: now,
      today: now,
    })
    this.setCanlendar(now)
  }
  getBackFill(startOfMonth) {
    const calendar:any = []
    const dayOfWeek = startOfMonth.day()
    if (!dayOfWeek) return
    startOfMonth = startOfMonth.subtract(dayOfWeek + 1, 'days')
    for (let i = dayOfWeek; i > 0; i -= 1) {
      startOfMonth = startOfMonth.add(1, 'days')
      calendar.push(startOfMonth)
    }
    return calendar
  }
  getForFill(endOfMonth) {
    const calendar:any = []
    const dayOfWeek = endOfMonth.day();
    if (dayOfWeek === 6) return
    for (let i = dayOfWeek; i < 6; i += 1) {
      endOfMonth = endOfMonth.add(1, 'days')
      calendar.push(endOfMonth)
    }
    return calendar
  }
  getCurrent(startOfMonth) {
    const calendar:any = []
    let clone = startOfMonth.clone()
    while(startOfMonth.month() === clone.month()) {
      calendar.push(clone)
      clone = clone.add(1, 'days')
    }
    return calendar
  }
  setCanlendar(time) {
    let calendar:any = []
    const startOfMonth = time.startOf('month')
    calendar = calendar.concat(this.getBackFill(startOfMonth.clone()))
    calendar = calendar.concat(this.getCurrent(startOfMonth.clone()))
    const endOfMonth = time.endOf('month')
    calendar = calendar.concat(this.getForFill(endOfMonth.clone()))
    calendar.forEach(item => {
      const lunar = DateUtil.solar2lunar(item.year(), item.month() + 1, item.date());
      item.lunar = lunar;
    });
    this.setState({
      calendar,
    })
  }
  getWeekList(data) {
    const weeks:any = []
    let ind = -1
    data.forEach(item => {
      if (item.day() === 0) {
        ind += 1;
        weeks[ind] = []
      }
      weeks[ind].push(item)
    })
    return weeks
  }
  changeMonth(directon:number) {
    const { time } = this.state
    let newDate;
    if (directon < 0) {
      newDate = time.subtract(1, 'month')
    }
    if (directon > 0) {
      newDate = time.add(1, 'month')
    }
    this.setState({
      time: newDate,
    })
    this.setCanlendar(newDate)
  }
  touchDotX:number = 0
  touchDotY:number = 0
  touchStart = (e) => {
    this.touchDotX = e.touches[0].pageX;
    this.touchDotY = e.touches[0].pageY;
  }
  touchEnd = (e) => {
    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - this.touchDotX;
    let tmY = touchMoveY - this.touchDotY;
    let absX = Math.abs(tmX);
    let absY = Math.abs(tmY);
    if (absX > 2 * absY) {
      if (tmX < 0) {
        this.changeMonth(1)
      } else {
        this.changeMonth(-1)
      }
    }
  }
  render() {
    const sysInfo = Taro.getSystemInfoSync();
    const { time, today, calendar } = this.state
    const header = <View className='cal-head' style={ `padding-top: ${sysInfo.statusBarHeight}px` }>
      <Text className='cal-head-title'>{ time.format('MMM YYYY') }</Text>
    </View>
    const weekList = this.getWeekList(calendar)
    const content = weekList.map((week:any, index) => {
      const days = week.map(day => {
        let dayClass = 'day';
        if (day.isSame(today, 'day')) dayClass += ' day_today';
        if (day.month() !== time.month()) dayClass += ' day_other';
        return <View className={ dayClass } key={day.format('MMDD')}>
          <Text className='day-date'>{ day.format('DD') }</Text>
          <Text className='day-lunar'>{ day.lunar.IDayCn }</Text>
        </View>
      })
      return <View className='week' key={`week-${index}`}>{ days }</View>
    })
    return (
      <View className='cal'>
        { header }
        <View className='cal-content' onTouchStart={ this.touchStart } onTouchEnd={ this.touchEnd }>
          { content }
        </View>
      </View>
    )
  }
}