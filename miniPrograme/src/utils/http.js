/**
 * Created by liyigang on 2/11/2020.
 */
import Taro, { Component } from '@tarojs/taro'
import {baseUrl, host} from './config'
function HttpConstructor(url, methods, data, headers={'content-type': 'application/json'}) {
  return new Promise((reslove, reject) => {
    const headersObj = Object.assign({}, headers)
    const token = Taro.getStorageSync('token')
    headersObj.token = token
    console.log('data', headersObj)
    Taro.request({
      url: host + baseUrl + url,
      data: data,
      method: methods,
      header: headersObj,
      success: (res) => {
        // if(res.data.code === 50004) {
        //   reSetToken(url, methods, data, headers).then(() => {
        //     HttpConstructor(url, 'post', data, headers).then((result) => {
        //       reslove(result)
        //     })
        //   })
        //   return
        // }
        reslove(res)
      },
      error: (error) => {
        console.log('接口异常')
        Taro.showToast({
          title: `异常${error}`,
          icon: 'none',
          duration: 2000
        })
        reject(error)
      }
    })
  })
}

// 请求50004 重新获取token
function reSetToken(preUrl, preMethods, preData, preHeaders) {
  let userInfo = Taro.getStorageSync('userInfo')
  const loginData = Object.assign({}, userInfo)
  return new Promise((reslove, reject) => {
    Taro.login({
      success: (res) => {
        loginData.code = res.code
        httpInstance.post('登录注册接口', loginData, {}).then((result) => {
          Taro.setStorageSync('token', result.data.data.token)
          reslove()
        })
      }
    })
  })
}
// http request 拦截器
const httpInstance = {
  host: host,
  baseUrl: baseUrl,
  post(url, data, headers) {
    return HttpConstructor(url, 'POST', data, headers)
  },
  get(url, data, headers) {
    return HttpConstructor(url, 'GET', data, headers)
  }
}

export default httpInstance
