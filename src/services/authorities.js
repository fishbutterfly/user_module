import Vue from 'vue'

class Authorities {
  get () {
    return Vue.prototype.$axios.get('/authorities').then(response => response.data)
  }
}

export default new Authorities()
