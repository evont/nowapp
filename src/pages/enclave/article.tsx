import Taro, { Component, Config } from '@tarojs/taro'
import { RichText, View, Text, Image } from '@tarojs/components'
import api from '../../util/api'
import env from '../../util/env'
import './article.scss'
import backBtn from '../../assets/icon-back.svg'

interface IState {
  loading: boolean,
  article: object,
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
    navigationStyle: 'custom',
  }

  state = {
    loading: true,
    article: {
      artTime: 0, 
      cateName: '', 
      artTitle: '', 
      artEditor: '',
      artThumb: '',
      artContent: '',
      artId: 0,
      shareDescription: ''
    }
  }

  onShareAppMessage(res) {
    const { shareDescription, artThumb, artId } = this.state.article;
    return {
      title: shareDescription,
      path: `/pages/enclave/article?id=${artId}`,
      imageUrl: artThumb,
    }
  }
  async componentDidMount() {
    const { id } = this.$router.params;
    Taro.request({
      url: api.getURL(api.APIMAP.ENCLAVE_ARTICLE, { id })
    }).then(res => {
      const { data } = res;
      const { result } = data;
      this.setState({
        article: result,
        loading: false,
      })
    })
    if (env.isWx) {
      Taro.showShareMenu();

    }
  }

  formateTime(time) {
    const mil = new Date(time * 1000);
    return `${mil.getFullYear()}-${mil.getMonth() + 1}-${mil.getDate()} ${mil.getHours()}:${mil.getMinutes()}`
  }

  formateArticle(article) {
    let content = ''
    content = article.replace(/<section/g, '<span class="section"').replace(/<\/section>/g, '</span>')
    content = content.replace(/<h(\d)/g, '<h$1 class="h$1"')
    content = content.replace(/<small/g, '<small class="small"')
    content = content.replace(/<p/g, '<p class="p"')
    content = content.replace(/<hr/g, '<hr class="hr"')
    content = content.replace(/<blockquote/g, '<blockquote class="blockquote"').replace(/<\/blockquote>/g, '</blockquote>')
    content = content.replace(/<footer/g, '<div class="footer"').replace(/<\/footer>/g, '</div>')
    content = content.replace(/<img/g, '<img class="img"')
    return content
  }

  back() {
    Taro.navigateBack({
      delta: 1
    })
  }
  render () {
    const sys = Taro.getSystemInfoSync()
    const encartStyle = `height: ${sys.windowHeight - sys.statusBarHeight- 40}px;top: ${sys.statusBarHeight + 40}px`
    const btnStyle = `top: ${sys.statusBarHeight}px`
    const { loading, article } = this.state
    const content = this.formateArticle(article.artContent);
    const main = 
      <View className='encart-main'>
        <View className='encart-head'>
          <Text className='encart-head-title'>{ article.artTitle }</Text>
          <View className='encart-head-editor'>
            <Text className='author'>{ article.artEditor }</Text>
            <Text className='time'>{ this.formateTime(article.artTime) }</Text>
          </View>
        </View>
        <View className='encart-content'>
          <RichText nodes={content}/>
        </View>
      </View>
      
    return (
      <View>
        <Image src={backBtn} className='back' style={btnStyle} onClick={this.back}/>
        <View className='encart' style={encartStyle}>
          {loading ? <Text className='encart-loading'>加载中...</Text> : main}
        </View>
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