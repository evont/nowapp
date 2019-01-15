import Taro from '@tarojs/taro'

// 'https://source.unsplash.com/random/500x400'
interface option {
  title?: string, 
  imageUrl?: string, 
  path?: string,
}
export default function withShare(opts:option = {}) {
  const defalutPath = 'pages/index/index';
  const defalutTitle = '今历-我们所拥有的，就是当下的一切';
  const defaultImageUrl = '';

  return function cpt(Components) {
    class WithShare extends Components {
      async componentWillMount() {
        Taro.showShareMenu()

        if (super.componentWillMount) {
          super.componentWillMount()
        }
      }

      // 点击分享的那一刻会进行调用
      onShareAppMessage() {
        if (super.onShareAppMessage) {
          super.onShareAppMessage()
          return
        }                                                  
        let { title, imageUrl, path = null } = opts
		
        // 从继承的组件获取配置
        if (this.$setSharePath && typeof this.$setSharePath === 'function') {
          path = this.$setSharePath()
        }
		
        // 从继承的组件获取配置
        if (this.$setShareTitle && typeof this.$setShareTitle === 'function') {
          title = this.$setShareTitle()
        }

        // 从继承的组件获取配置
        if (
          this.$setShareImageUrl &&
          typeof this.$setShareImageUrl === 'function'
        ) {
          imageUrl = this.$setShareImageUrl()
        }

        if (!path) {
          path = defalutPath
        }
		
        return {
          title: title || defalutTitle,
          path: path,
          imageUrl: imageUrl || defaultImageUrl
        }
      }

      render() {
        return super.render()
      }
    }
    return WithShare
  }
}