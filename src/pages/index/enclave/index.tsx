import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Enclaveblock } from '../../../components/enclaveinfo'
import api from '../../../util/api'
import Loading from '../../../components/loading'

import './index.scss'

interface article {
  isMain?: false,
  artTime: number,
  cateName: string, 
  artTitle: string, 
  artEditor: string,
  artThumb: string,
  artId: number,
}

interface IState {
  isLoading: boolean,
  isFetching: boolean,
  enclave: object,
}

class Enclave extends Component<{}, IState> {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '飞地'
  }

  state = {
    isLoading: true,
    isFetching: false,
    enclave: {
      article: [],
      articleRecommend: [],
      pageInfo: {
        currentPage: '1',
        total: 1,
      }
    }
  }

  onReachBottom() {
    const { enclave } = this.state;
    const page = parseInt(enclave.pageInfo.currentPage) + 1;
    this.fetchData(page);
  }

  fetchData(page = 1) {
    this.setState({
      isFetching: true,
    })
    const { enclave } = this.state;
    const now = new Date();
    const today = new Date(`${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`)
    let timestamp = today.getTime().toString().slice(0, -3);
    if (enclave.article && enclave.article.length) {
      const firstArticle:article = enclave.article.slice(-1)[0];
      timestamp = `${firstArticle.artTime}`;
    }
    try {
      Taro.request({
        url: api.getURL(api.APIMAP.ENCLAVE, { page, timestamp: Number(timestamp) })
      }).then(res => {
        const { data } = res;
        const { result } = data;
        if (result.article) {
          result.article[0].isMain = true;
        }
        if (page > 1) {
          result.article = enclave.article.concat(result.article);
        }
        this.setState({
          enclave: result, 
          isLoading: false,
          isFetching: false, 
        })
      })
    } catch (error) {
      Taro.showToast({
        title: '服务器开小差了'
      })
    }
  }
  componentDidMount() {
    this.fetchData();
  }

  render () {
    const { isLoading, isFetching, enclave } = this.state;
    const { articleRecommend, article } = enclave;
    const recommendArticles = articleRecommend.map((item:article, index) => <Enclaveblock data={item} key={index} isMain={item.isMain} />)
    const articles = article.map((item:article, index) => <Enclaveblock data={item} key={index} isMain={item.isMain} />)
    return (
      isLoading ? <Loading />
      :
        <View className='enclave'>
          <View className='enclave-main'>
          { recommendArticles }
          { articles }
          </View>
          { isFetching ? <Text className='loading'>加载中...</Text> : ''}
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

export default Enclave