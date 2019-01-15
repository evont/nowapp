import Taro, { Component, Config } from '@tarojs/taro'
import { View, RichText, Text, Button } from '@tarojs/components'
import api from '../../util/api'
import withShare from '../../util/withShare'

import './index.scss'
import Loading from '../../components/loading'

interface IState {
  isLoading: boolean,
  data: object,
  date: object,
  content: string,
  author: string,
  title: string,
  digest: string,
}

// @ts-ignore
@withShare()
class Totheend extends Component<{}, IState> {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '观止'
  }
  
  state = {
    isLoading: true,
    data: {},
    date: {
      curr: '',
    },
    content: '',
    author: '',
    title: '',
    digest: ''
  }

  $setSharePath = () => `pages/totheend/index?date=${this.state.date.curr}`
  $setShareTitle = () => `观止 | ${this.state.title}`

  fetchData(date = '') {
    try {
      Taro.request({
        url: api.getURL(api.APIMAP.TOTHEEND, { date, })
      }).then(res => {
        const { data } = res;
        const { content = '暂无内容', author = '佚名', title = '', digest = '', date } = data.data;
        this.setState({
          data: data.data || {},
          content,
          author,
          title,
          digest,
          date,
          isLoading: false,
        })
        Taro.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
      })
    } catch (error) {
      Taro.showToast({
        title: '服务器开小差了'
      })
    }
  }
  componentDidMount() {
    const { date = '' } = this.$router.params;
    this.fetchData(date)
  }

  render () {
    const { isLoading } = this.state;
    return (
      isLoading ?
        <Loading />
        :
        <View className='tte'>
          <View className='tte-head'>
            <Text className='tte-title'>{this.state.title}</Text>
            <Text className='tte-author'>{this.state.author}</Text>
          </View>
          <RichText className='tte-content' nodes={this.state.content} />
          <Button className='tte-random' plain type='default' size='mini' onClick={this.fetchData.bind(this, '')}>看看新文章</Button>
        </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Totheend