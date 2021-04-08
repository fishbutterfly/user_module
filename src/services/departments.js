import Vue from 'vue'

class Departments {
  getAll (parentCode) {
    if (parentCode) {
      return Vue.prototype.$axios.get(`/departments?parentCode=${parentCode}`)
        .then(response => response.data)
    } else {
      return Vue.prototype.$axios.get('/departments')
        .then(response => response.data)
    }
  }

  getDept () {
    return Vue.prototype.$axios.get('/departments', {
      params: {
        preload: true
      }
    })
      .then(response => response.data)
  }

  create (name, parentCode) {
    return Vue.prototype.$axios.post('/departments/create', {
      name: name,
      parentCode: parentCode
    }).then(response => response.data)
  }

  modify (deptCode, name) {
    return Vue.prototype.$axios.put(`/departments/${deptCode}`, name)
  }

  delete (deptCode) {
    return Vue.prototype.$axios.delete(`/departments/${deptCode}`)
  }

  getMembers (deptCode, pageable, search) {
    return Vue.prototype.$axios.post(`/departments/${deptCode}/members`, null, {
      params: {
        size: pageable.size,
        page: pageable.page,
        search: search
      }
    })
  }

  leadIn (file) {
    return Vue.prototype.$axios.post('/departments/import', file)
  }
}
export default new Departments()
