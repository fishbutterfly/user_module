import Vue from 'vue'
import router from '../router'

class Auth {
  login (user) {
    return Vue.prototype.$axios.post('/auth/login', {
      username: user.username,
      password: user.password
    }).then(response => {
      if (response.data.accessToken) {
        sessionStorage.setItem('user', JSON.stringify(response.data))
      }
      return response
    })
  }

  logout () {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('activeIndex')
    router.push({ path: '/login' })
  }
}

export default new Auth()
