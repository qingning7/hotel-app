export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/list/index',
    'pages/detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  permission: {
    'scope.userLocation': {
      desc: '用于定位到所在城市并推荐酒店'
    }
  },
  requiredPrivateInfos: ['getLocation']
})
