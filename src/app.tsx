import Taro, { Component, Config } from '@tarojs/taro'
import '@tarojs/async-await'

import Index from './pages/index'

import './app.scss'

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
      'pages/enclave/index',
      'pages/index/index',
      'pages/poem/index',
      'pages/enclave/article',
      'pages/totheend/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#000',
      navigationBarTitleText: '今历',
      navigationBarTextStyle: 'white',
    },
    tabBar: {
      color: '#aeaeae',
      selectedColor: '#444',
      borderStyle: 'white',
      list: [
        {
          pagePath: 'pages/index/index',
          iconPath: 'assets/T.png',
          selectedIconPath: 'assets/T_on.png',
          text: "方今"
        },
        {
          pagePath: "pages/poem/index",
          text: "搜韵",
          iconPath: 'assets/O.png',
          selectedIconPath: 'assets/O_on.png',
        },
        {
          pagePath: "pages/enclave/index",
          text: "飞地",
          iconPath: 'assets/D.png',
          selectedIconPath: 'assets/D_on.png',
        },
        {
          pagePath: "pages/totheend/index",
          text: "观止",
          iconPath: 'assets/Y.png',
          selectedIconPath: 'assets/Y_on.png',
        }
      ]
    },
  }

  // componentDidMount () {
  //   if (env.isWx) {
  //     wx.showShareMenu();
  //   }
  // }
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
