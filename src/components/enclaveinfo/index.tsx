import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text } from '@tarojs/components'

interface IProps {
  isMain?: false,
  data: {
    artTime: number, 
    cateName: string, 
    artTitle: string, 
    artEditor: string,
    artThumb: string,
    artId: number,
  },
}
import './index.scss'

class Enclaveblock extends Component<IProps, {}> {
  static defaultProps = {
    isMain: false,
    data: {
      artTime: 0, 
      cateName: '', 
      artTitle: '', 
      artEditor: '',
      artThumb: '',
      artId: 0,
    }
  }
  goDetail = () => {
    const { artId } = this.props.data;
    Taro.navigateTo({
      url: `/pages/enclave/article?id=${artId}`
    })
  }
  render () {
    const { data, isMain } = this.props;
    const { artTime, cateName, artTitle, artEditor, artThumb } = data;
    function weekDay(date) {
      date = `${date}000`;
      const map = ['日', '一', '二', '三', '四', '五', '六'];
      const realDate = new Date(Number(date));
      const day = realDate.getDay();
      return `周${map[day]}`;
    }
    return (
      <View className='info'>
        { isMain ? <Text className='info-date'>{ weekDay(artTime) }</Text> : ''}
        <View className='info-block' onClick={this.goDetail}>
          <View className='info-block-thumb'>
            <Image src={artThumb} className='thumb' />
            <Text className='cate'>{ cateName }</Text>
          </View>
          <Text className='info-block-title'>{ artTitle }</Text>
          <Text className='info-block-editor'>{ artEditor }</Text>
        </View>
      </View>
    )
  }
}

export { Enclaveblock }