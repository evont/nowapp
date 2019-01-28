import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, RichText } from '@tarojs/components'

import api from '../../../util/api'

import leftPng from '../../../assets/icon-left.png'
import rightPng from '../../../assets/icon-right.png'
import './index.scss'

interface clause {
  Content: string,
  Comments?: [],
  BreakAfter?: boolean,
}

interface IState {
  isLoading: boolean,
  showTitle: number,
  Poem: {
    Author: string,
    Title: {
      Content: string
    },
    IsTwoClausesPerSentence: boolean,
    Clauses: [],
  },
  Date: string,
  Index: number,
  Total: number,
}


function IsInlineComment(content) {
  let inline = true;
  for (let i = 0; i < content.length; i++) {
      if (content[i] >= "㐀" && content[i] <= "﨩") {
          inline = false;
          break;
      }
  }

  return inline;
}
function formatClause(clause) {
    let content = clause.Content;
    if (clause.Comments) {
      for (let j = clause.Comments.length - 1; j >= 0; j-=1) {
        const comment = clause.Comments[j];
        if (comment.Type != "Text") {
          continue;
        }
        if (IsInlineComment(comment.Content)) {
          content = content.substr(0, comment.Index) + comment.Content + content.substr(comment.Index);
        }
      }
    }
    return content;
}

class Poem extends Component<{}, IState> {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '搜韵'
  }

  state = {
    isLoading: true,
    showTitle: 1,
    Poem: {
      Author: '',
      Title: {
        Content: ''
      },
      IsTwoClausesPerSentence: true,
      Clauses: [],
    },
    Date: '',
    Index: 0,
    Total: 0,
  } as IState

  fetchData(direction = 1) {
    Taro.showLoading({
      title: '加载中...',
    })
    try {
      const ind = this.state.Index
      const total = this.state.Total
      if (ind === 0 && direction === -1) {
        Taro.showToast({
          title: '已经是第一首',
          icon: 'none'
        })
      } else if (ind < total || direction === 0) {
        Taro.request({
          url: api.getURL(api.APIMAP.POEM, { index: ind + direction }),
        }).then(res => {
          Taro.hideLoading()
          const { data } = res; 
          const { Content = {}, Date = '', Index = 1, Total = 0 } = data;
          const Poem = Content.Poem || {};
          this.setState({
            Poem,
            Date,
            Index,
            Total,
            showTitle: 1,
            isLoading: false,
          })
        });
      } else {
        Taro.showToast({
          title: '没有更多了',
          icon: 'none'
        })
      }
    } catch (error) {
      Taro.showToast({
        title: '服务器开小差了',
        icon: 'none'
      })
    }
  }

  showOrigin = () => {
    const { showTitle } = this.state;
    this.setState({
      showTitle: 1 - showTitle,
    })
  }
  
  async componentDidMount() {
    this.fetchData(0);
  }

  render () {
    const { Poem, Date, showTitle } = this.state;
    const { Clauses } = Poem;
    let poemContent = '';
    if (Clauses) {
      poemContent = '<p class="poem-clauses-clause">';
      for (let i = 0, len = Clauses.length; i < len; i += 1) {
        const clause:clause = Clauses[i];
        let content = formatClause(clause);
        
        if (((Poem.IsTwoClausesPerSentence && i % 2 == 1) || "。；！？".indexOf(clause.Content.substr(clause.Content.length - 1)) >= 0) && i < len - 1)
        {
          content += '</p><p class="poem-clauses-clause">';
        }
        if (clause.BreakAfter)
        {
          content += '</p><p class="poem-clauses-clause">';
        }
        poemContent += content;
      }
    }
    return (
      <View className='poem'>
        <View className='poem-main'>
          <View className='poem-head'>
            <Text className='poem-head-date'>{ Date }</Text>
            <Text className={ `poem-head-title ${showTitle ? 'poem-head-title_active' : '' }` } onClick={this.showOrigin}>{ Poem.Title.Content }</Text>
            <Text className='poem-head-author'>{ Poem.Author }</Text>
          </View>
          <RichText nodes={poemContent} className='poem-clauses' />
        </View>
        <View className='pagination pagination_left' onClick={this.fetchData.bind(this, -1)}>
          <Image src={leftPng} className='pagination-img'/>
        </View>
        <View className='pagination pagination_right' onClick={this.fetchData.bind(this, 1)}>
          <Image src={rightPng} className='pagination-img'/>
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

export default Poem
