import Vue from 'vue'

class Roles {
  getList () {
    return Vue.prototype.$axios.get('/roles')
  }

  getRoles (pageable, name) {
    return Vue.prototype.$axios.post('/roles', null, {
      params: {
        size: pageable.size,
        page: pageable.page,
        name
      }
    })
  }

  get (id) {
    return Vue.prototype.$axios.get(`/roles/${id}`).then(response => response.data)
  }

  modify (id, roleMsg) {
    return Vue.prototype.$axios.put(`/roles/${id}`, roleMsg)
  }

  delete (id) {
    return Vue.prototype.$axios.delete(`/roles/${id}`)
  }

  getMembers (id, queryMember, pageable) {
    return Vue.prototype.$axios.post(`/roles/${id}/members`, queryMember, {
      params: {
        size: pageable.size,
        page: pageable.page
      }
    })
  }

  getRelation (id, userId) {
    return Vue.prototype.$axios.put(`/roles/${id}/members`, userId)
  }

  cancelRelation (id, userId) {
    return Vue.prototype.$axios.delete(`/roles/${id}/members/${userId}`)
  }

  create (roleMsg) {
    return Vue.prototype.$axios.post('/roles/create', roleMsg).then(response => response.data)
  }
}
export default new Roles()
