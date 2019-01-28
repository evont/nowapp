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
      'pages/index/index',
      'pages/enclave/article',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#333',
      navigationBarTitleText: '今历',
      navigationBarTextStyle: 'white',
    },
    // tabBar: {
    //   color: '#aeaeae',
    //   selectedColor: '#444',
    //   borderStyle: 'white',
    //   backgroundColor: '#f5f5f5',
    //   list: [
    //     {
    //       pagePath: 'pages/index/index',
    //       iconPath: 'assets/icon-home.png',
    //       selectedIconPath: 'assets/icon-home_on.png',
    //       text: "方今"
    //     },
    //     {
    //       pagePath: "pages/poem/index",
    //       text: "搜韵",
    //       iconPath: 'assets/icon-poem.png',
    //       selectedIconPath: 'assets/icon-poem_on.png',
    //     },
    //     {
    //       pagePath: "pages/enclave/index",
    //       text: "飞地",
    //       iconPath: 'assets/icon-enclave.png',
    //       selectedIconPath: 'assets/icon-enclave_on.png',
    //     },
    //     {
    //       pagePath: "pages/totheend/index",
    //       text: "观止",
    //       iconPath: 'assets/icon-article.png',
    //       selectedIconPath: 'assets/icon-article_on.png',
    //     }
    //   ]
    // },
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
