import Taro from '@tarojs/taro'
import { View, Image, Input } from '@tarojs/components'
import { AtList, AtListItem, AtButton, AtIcon, AtModal, AtModalHeader, AtModalContent, AtTextarea, AtModalAction, AtInput } from 'taro-ui'
import * as service from './service'
import './home.scss'

export default class Index extends Taro.Component {
  config = {
    navigationBarTitleText: '备忘录'
  }

  constructor () {
    super(...arguments)

    this.state = {
      taskList: [],
      isShowAddModal: false,
      content: '',
      isShowBindPhoneModal: true,
      phone: ''
    }
  }

  componentDidMount() {
    this.getTaskList()
  }

  getTaskList() {
    service.getTaskList({}).then((res) => {
      console.log('结果', res.data)
      this.setState({
        taskList: res.data.data
      })
    })
  }

  addNewTask() {
    this.setState({
      isShowAddModal: true
    })
  }

  getPhoneInfo(val) {
    console.log('val', val)
  }

  handleChange(val) {
    this.setState({
      content: val
    })
  }

  handleChangePhone(val) {
    this.setState({
      phone: val
    })
  }

  bindPhoneNumber() {
    
  }

  getUserInfo(val) {
    const {userInfo} = val.detail
    if(userInfo) {
      Taro.setStorage({
        key:"userInfo",
        data:userInfo
      })
    } else {
      Taro.showToast({
        title: '请授权后使用',
        icon: 'none',
        duration: 2000
      })
    }
  }


  render () {
    const { taskList, isShowAddModal, isShowBindPhoneModal } = this.state

    return (
      <View className='page page-index'>
        <AtList>
          {taskList && taskList.map((item) => {
            return (
              <AtListItem
                title={item.work_content}
                thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
              />
            )
          })}
        </AtList>

        <AtButton type='primary' className='add-new-button' openType="getUserInfo" onGetUserInfo={(e) => {this.getUserInfo(e)}}>
          <AtIcon value='add' size='15' />
          <View style={{marginLeft: '5px', display: 'inline-block'}}>
            添加备忘
          </View>
        </AtButton>

        <AtModal isOpened={isShowAddModal}>
          <AtModalHeader>添加备忘录</AtModalHeader>
          <AtModalContent>
            <AtTextarea
              value={this.state.content}
              onChange={this.handleChange.bind(this)}
              maxLength={200}
              placeholder='今日想要记住的事情是？'
            />
          </AtModalContent>
          <AtModalAction>
            <Button>取消</Button> <Button>确定</Button>
          </AtModalAction>
        </AtModal>

        <AtModal isOpened={isShowBindPhoneModal}>
          <AtModalHeader>绑定手机</AtModalHeader>
          <AtModalContent>
            <AtInput
              clear
              title=''
              type='text'
              maxLength='11'
              placeholder='请输入手机'
              value={this.state.phone}
              onChange={this.handleChangePhone.bind(this)}
            >
              {/*<AtButton style={{display: 'inline-block'}} openType="getPhoneNumber" onGetPhoneNumber={(e) => {this.getPhoneInfo(e)}}>*/}
              {/*  获取手机号*/}
              {/*</AtButton>*/}
            </AtInput>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={() => {this.setState({isShowBindPhoneModal: false})}}>取消</Button>
            <Button onClick={() => {this.bindPhoneNumber()}}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
