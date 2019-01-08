import Taro, { Component, Config } from '@tarojs/taro'
import '@tarojs/async-await'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'

import configStore from './store'

import './app.scss'

const store = configStore()

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/poem/index',
      'pages/aeon/index',
      'pages/enclave/index',
      'pages/totheend/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#000',
      navigationBarTitleText: '今历',
      navigationBarTextStyle: 'white',
    },
    tabBar: {
      backgroundColor: '#000',
      color: '#fff',
      position: 'top',
      list: [
        {
          pagePath: 'pages/index/index',
          text: "方今"
        },
        {
          pagePath: "pages/poem/index",
          text: "搜韵"
        },
        {
          pagePath: "pages/enclave/index",
          text: "飞地"
        },
        {
          pagePath: "pages/aeon/index",
          text: "万古"
        },
        {
          pagePath: "pages/totheend/index",
          text: "观止"
        }
      ]
    },
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
