'use strict'

import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '../router'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common.Origin = process.env.baseURL
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.defaults.baseURL = process.env.VUE_APP_SERVICE_URL
const config = {
  // baseURL: process.env.VUE_APP_SERVICE_URL,
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true // Check cross-site Access-Control
}

const _axios = axios.create(config)
_axios.interceptors.request.use(
  function (config) {
    const userInfo = JSON.parse(sessionStorage.getItem('user'))
    // 刷新token
    async function doRefresh () {
      const THRESHOLD = 300 * 1000
      // 当前时间的时间戳
      var timestamp = new Date().getTime()
      // 过期时间的时间戳
      var expireTime = JSON.parse(sessionStorage.getItem('time')).exp * 1000
      if ((expireTime - timestamp > THRESHOLD) ||
          (expireTime < timestamp) ||
          (store.state.refreshToken.is_refresh)) {
        return
      }
      store.commit('refreshToken/is_refresh', true)
      store.dispatch('refreshToken/refresh')
    }
    // Do something before request is sent
    // config.headers.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`
    if (router.history.current.path === '/login') {
      return config
    } else {
      doRefresh()
    }
    if (userInfo) {
      config.headers.Authorization = userInfo.type + ' ' + userInfo.accessToken
      return config
    }
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return Promise.resolve(response)
  },
  function (error) {
    switch (error.response.status) {
      case 400: case 409:
        Message.error(error.response.data.msg)
        break
      case 302:
        sessionStorage.setItem('user', JSON.stringify(error.response.data))
        router.push({ name: 'ModifyPassword' })
        break
      case 401:
        if ((!sessionStorage.getItem('user')) && error.config.url.indexOf('/login') !== -1) {
          Message.error('用户名或密码输入错误')
          break
        } else if (sessionStorage.getItem('user')) {
          store.dispatch('auth/logout')
          Message.error('登录过期，请重新登录')
          break
        }
        break
      case 403:
        Message.error('尚未被授权')
        break
      case 500:
        Message.error('服务器异常，请稍后重试')
        break
      default:
        Message.error('网络异常，请稍后重试')
    }
    return Promise.reject(error.response)
  }
)

Plugin.install = function (Vue, options) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios
      }
    },
    $axios: {
      get () {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
