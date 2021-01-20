import Taro, { Component } from '@tarojs/taro'
import Home from './pages/home/home'

import './app.scss'

class App extends Component {
  config = {
    pages: [
      'pages/home/home'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return <Home />
  }
}

Taro.render(<App />, document.getElementById('app'))
