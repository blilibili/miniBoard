import Taro from '@tarojs/taro'
import { View, Image, Input, ScrollView, Button } from '@tarojs/components'
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
      isShowBindPhoneModal: false,
      phone: ''
    }
  }

  componentDidShow () {
    let phone = Taro.getStorageSync('phone')
    if(phone != '') {
      this.getTaskList()
    }
  }

  isShowBindPhone() {
    let showStatus = null
    let phone = Taro.getStorageSync('phone')
    if(phone == '') {
      showStatus = true
    } else {
      this.getUserIdByPhone()
      this.getTaskList()
      showStatus = false
    }

    this.setState({
      isShowBindPhoneModal: showStatus
    })
    this.forceUpdate()
  }

  getTaskList() {
    let userInfo = Taro.getStorageSync('userInfo')
    let params = {
      userId: userInfo.id
    }
    Taro.showLoading({
      title: '加载中...',
    })
    service.getTaskList(params).then((res) => {
      Taro.hideLoading()
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
    let params = {
      phone: this.state.phone
    }
    Taro.showLoading({
      title: '加载中...',
    })
    service.addNewUsers(params).then((res) => {
      Taro.hideLoading()
      this.setState({
        isShowBindPhoneModal: false
      }, () => {
        Taro.setStorageSync('phone', this.state.phone)
        this.getUserIdByPhone()
      })
    })
  }

  getUserIdByPhone() {
    let params = {
      phone: Taro.getStorageSync('phone')
    }
    Taro.showLoading({
      title: '加载中...',
    })
    service.getUsersByPhone(params).then((res) => {
      Taro.hideLoading()
      Taro.setStorageSync('userInfo', res.data.data)
      this.getTaskList()
    })
  }

  getUserInfo(val) {
    const {userInfo} = val.detail
    if(userInfo) {
      let phone = Taro.getStorageSync('phone')
      if(phone == '') {
        this.isShowBindPhone()
        return
      }

      let isReg = Taro.getStorageSync('isReg')
      if(isReg) {
        this.setState({
          isShowAddModal: true
        })
        return
      }
      Taro.setStorageSync('userInfo', userInfo)
      let params = {
        username: userInfo.nickName,
        gender: userInfo.gender,
        avatar: userInfo.avatarUrl,
        province: userInfo.province,
        city: userInfo.city,
        country: userInfo.country,
        phone: Taro.getStorageSync('phone')
      }

      var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;

      params.username =  params.username.replace(regStr, "");

      Taro.showLoading({
        title: '加载中...',
      })
      service.updateUsersInfo(params).then((res) => {
        Taro.hideLoading()
        Taro.setStorageSync('isReg', true)
        this.setState({
          isShowAddModal: true
        }, () => {
          this.getUserIdByPhone()
        })
      })
    } else {
      Taro.showToast({
        title: '请授权后使用',
        icon: 'none',
        duration: 2000
      })
    }
  }

  saveNewTask() {
    let userInfo = Taro.getStorageSync('userInfo')
    let params = {
      personId: userInfo.id,
      content: this.state.content
    }
    Taro.showLoading({
      title: '加载中...',
    })
    service.addNewTask(params).then((res) => {
      Taro.hideLoading()
      Taro.showToast({
        title: '新增成功',
        icon: 'success',
        duration: 2000
      })
      this.getTaskList()
      this.setState({
        isShowAddModal: false,
        content: ''
      })
    })
  }

  render () {
    const { taskList, isShowAddModal, isShowBindPhoneModal } = this.state

    return (
      <View className='page page-index'>
        <ScrollView
          scrollY
          scrollWithAnimation
          className='task-content-container'
        >
          {taskList && taskList.length > 0? <AtList>
            {taskList && taskList.map((item) => {
              return (
                <AtListItem
                  title={item.work_content}
                  thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
                />
              )
            })}
          </AtList>:
          <View className='no-words'>暂无数据</View>
          }
        </ScrollView>

        <AtButton type='primary' className='add-new-button' openType="getUserInfo" onGetUserInfo={(e) => {this.getUserInfo(e)}}>
          <AtIcon value='add' size='15' />
          <View style={{marginLeft: '5px', display: 'inline-block'}}>
            添加备忘
          </View>
        </AtButton>

        <AtModal isOpened={isShowAddModal}>
          <AtModalHeader>添加备忘录</AtModalHeader>
          <AtModalContent>
            {isShowAddModal && <AtTextarea
              style={{position: 'relative', zIndex: 100}}
              value={this.state.content}
              onChange={this.handleChange.bind(this)}
              maxLength={200}
              placeholder='今日想要记住的事情是？'
            />}
          </AtModalContent>
          <AtModalAction>
            <Button onClick={() => {this.setState({isShowAddModal: false})}}>取消</Button>
            <Button onClick={() => {this.saveNewTask()}}>确定</Button>
          </AtModalAction>
        </AtModal>

        <AtModal isOpened={isShowBindPhoneModal}>
          <AtModalHeader>绑定手机</AtModalHeader>
          <AtModalContent>
            {isShowBindPhoneModal && <AtInput
              clear
              title=''
              type='number'
              maxLength='11'
              placeholder='请输入手机'
              value={this.state.phone}
              onChange={this.handleChangePhone.bind(this)}
            >
              {/*<AtButton style={{display: 'inline-block'}} openType="getPhoneNumber" onGetPhoneNumber={(e) => {this.getPhoneInfo(e)}}>*/}
              {/*  获取手机号*/}
              {/*</AtButton>*/}
            </AtInput>}
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