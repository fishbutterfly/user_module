import Vue from 'vue'

class Users {
  modifyPersonal (userMsg) {
    return Vue.prototype.$axios.put('/users', userMsg)
  }

  get (id) {
    return Vue.prototype.$axios.get(`/users/${id}`).then(response => response.data)
  }

  create (userMsg) {
    return Vue.prototype.$axios.post('/users/create', userMsg).then(response => response.data)
  }

  modify (id, userMsg) {
    return Vue.prototype.$axios.put(`/users/${id}`, userMsg)
  }

  delete (id) {
    return Vue.prototype.$axios.delete(`/users/${id}`)
  }

  resetPassword (id) {
    return Vue.prototype.$axios.put(`/users/passwords/${id}`)
  }

  modifyPassword (id, newPassword) {
    return Vue.prototype.$axios.put(`/users/${id}/password`, newPassword)
  }

  upload (file) {
    return Vue.prototype.$axios.post('/users/photoes', file)
  }
}
export default new Users()
