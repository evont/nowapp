import Taro from '@tarojs/taro'

const ENV = Taro.getEnv();
const isWx = ENV === Taro.ENV_TYPE.WEAPP;
const isWeb = ENV === Taro.ENV_TYPE.WEB;

export default {
  isWx,
  isWeb,
}