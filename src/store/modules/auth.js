import api from '@/services/api'

export default {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem('token') || null
  },
  mutations: {
    setUser(state, user) {
      console.log('Setting user:', user)
      state.user = user
    },
    setToken(state, token) {
      console.log('Setting token:', token)
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    }
  },
  actions: {
    initializeFromToken({ state, commit }) {
      if (state.token) {
        try {
          const payload = JSON.parse(atob(state.token.split('.')[1]))
          commit('setUser', payload)
        } catch (error) {
          console.error('Failed to initialize user from token:', error)
          commit('setToken', null)
          commit('setUser', null)
        }
      }
    },
    async loginWithGoogle({ commit }, googleResponse) {
      try {
        console.log('Processing Google login with code:', googleResponse.code)
        const response = await api.post('/auth/google', { 
          code: googleResponse.code
        })
        console.log('Backend response:', response.data)
        
        commit('setToken', response.data.jwt)
        const payload = JSON.parse(atob(response.data.jwt.split('.')[1]))
        commit('setUser', payload)
        return response
      } catch (error) {
        console.error('Login failed in auth module:', error)
        if (error.response) {
          console.error('Backend error response:', error.response.data)
        }
        throw error
      }
    },
    logout({ commit }) {
      commit('setUser', null)
      commit('setToken', null)
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user
  }
} 