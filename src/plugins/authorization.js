import Vue from 'vue'
const Authorization = {}
const _hasRole = function (name) {
  const user = JSON.parse(sessionStorage.getItem('user')).authorities
  var isExist = false
  user.map(item => {
    if (item === name) {
      isExist = true
      return isExist
    }
  })
  return isExist
}
Authorization.install = function (Vue, options) {
  Vue.prototype.$hasRole = _hasRole
}
Vue.use(Authorization)
export default Authorization
