import Vue from 'vue'

class Groups {
  getAll (pageable, name) {
    return Vue.prototype.$axios.post('/groups', null, {
      params: {
        size: pageable.size,
        page: pageable.page,
        name
      }
    })
  }

  modify (id, queryMsg) {
    return Vue.prototype.$axios.put(`/groups/${id}`, queryMsg).then(response => response.data)
  }

  delete (id) {
    return Vue.prototype.$axios.delete(`/groups/${id}`)
  }

  getMembers (id, queryMsg, pageable) {
    return Vue.prototype.$axios.post(`/groups/${id}/members`, queryMsg, {
      params: pageable
    })
  }

  getRelation (id, userIds) {
    return Vue.prototype.$axios.put(`/groups/${id}/members`, { userIds })
  }

  cancelRelation (id, userId) {
    return Vue.prototype.$axios.delete(`/groups/${id}/members/${userId}`)
  }

  create (createMsg) {
    return Vue.prototype.$axios.post('/groups/create', createMsg)
  }
}

export default new Groups()
