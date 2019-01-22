import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import dayJs from 'dayjs'
import './index.scss'
import DateUtil from '../../util/date'
interface IProps {
  handleDate: Function,
}
export default class Calendar extends Component<IProps, {}> {
  state = {
    time: dayJs(),
    today: dayJs(),
    calendar: [],
    isShowCalendar: 0,
  }
  getBarHeight() {
    const query = Taro.createSelectorQuery().in(this.$scope)
    return new Promise((resolve, reject) => {
      query.select('#cal-head').boundingClientRect((rect:any) => {
        if (rect) {
          resolve(rect.height)
        } else {
          resolve()
        }
      }).exec()
    })
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
    const { time, today } = this.state
    let newDate;
    if (directon < 0) {
      newDate = time.subtract(1, 'month').startOf('month')
    }
    if (directon > 0) {
      newDate = time.add(1, 'month').startOf('month')
    }
    if (newDate.month() === today.month()) {
      newDate = today;
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
  setDay(day) {
    const { time } = this.state
    const newDay = dayJs(new Date(day.$y, day.$M, day.$D))
    if (newDay.month() !== time.month()) {
      this.changeMonth(newDay.isBefore(time) ? -1 : 1)
    }
    this.setState({
      time: newDay,
      isShowCalendar: 0,
    })
    if (this.props.handleDate) {
      this.props.handleDate(newDay)
    }
  }
  toggleCalendar = () => {
    const { isShowCalendar } = this.state
    this.setState({
      isShowCalendar: 1 - isShowCalendar,
    })
  }
  render() {
    const sysInfo = Taro.getSystemInfoSync();
    const { time, today, calendar, isShowCalendar } = this.state
    const lunar = DateUtil.solar2lunar(time.year(), time.month() + 1, time.date());
    const header = (
      <View className='cal-head' style={ `padding-top: ${sysInfo.statusBarHeight}px` } onClick={ this.toggleCalendar }>
        <Text className='cal-head-title'>{ time.format('ddd MMM DD') }</Text>
        <Text className='cal-head-subTitle'>{ lunar.monthAlias } / { lunar.Term }</Text>
      </View>
    )
    const weekList = this.getWeekList(calendar)
    const content = weekList.map((week:any, index) => {
      const days = week.map(day => {
        let dayClass = 'day';
        if (day.isSame(today, 'day')) {
          dayClass += ' day_today';
        } else if (day.isSame(time, 'day')) {
          dayClass += ' day_select';
        }
        if (day.month() !== time.month()) dayClass += ' day_other';
        return <View className={ dayClass } key={day.format('MMDD')} onClick={this.setDay.bind(this, day)}>
          <Text className='day-date'>{ day.format('DD') }</Text>
          <Text className='day-lunar'>{ day.lunar.IDayCn }</Text>
        </View>
      })
      return <View className='week' key={`week-${index}`}>{ days }</View>
    })
    return (
      <View className='cal'>
        <View id='cal-head'>
          { header }
        </View>
        <View className={ `cal-content ${isShowCalendar ? 'cal-content_active' : ''}`} onTouchStart={ this.touchStart } onTouchEnd={ this.touchEnd }>
          { content }
        </View>
      </View>
    )
  }
}