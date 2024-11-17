import { createStore } from 'vuex'
import auth from './modules/auth'
import api from '@/services/api'

const store = createStore({
  state: {
    runners: [],
    loading: false,
    error: null,
    results: [],
    seasons: [],
    races: [],
    selectedRunner: null,
    runnerResults: [],
    selectedRace: null,
    raceResults: []
  },
  mutations: {
    setRunners(state, runners) {
      state.runners = runners
    },
    setResults(state, results) {
      state.results = results
    },
    setSeasons(state, seasons) {
      state.seasons = seasons
    },
    setRaces(state, races) {
      state.races = races
    },
    setSelectedRunner(state, runner) {
      state.selectedRunner = runner
    },
    setRunnerResults(state, results) {
      state.runnerResults = results
    },
    setSelectedRace(state, race) {
      state.selectedRace = race
    },
    setRaceResults(state, results) {
      state.raceResults = results
    }
  },
  actions: {
    async fetchRunners({ commit }) {
      try {
        const response = await api.get('/runners')
        commit('setRunners', response.data)
      } catch (error) {
        console.error('Error fetching runners:', error)
        throw error
      }
    },
    async fetchResults({ commit }) {
      try {
        const response = await api.get('/results')
        commit('setResults', response.data)
      } catch (error) {
        console.error('Error fetching results:', error)
        throw error
      }
    },
    async fetchSeasons({ commit }) {
      try {
        const response = await api.get('/seasons')
        commit('setSeasons', response.data)
      } catch (error) {
        console.error('Error fetching seasons:', error)
        throw error
      }
    },
    async fetchRaces({ commit }) {
      try {
        const response = await api.get('/races')
        commit('setRaces', response.data)
      } catch (error) {
        console.error('Error fetching races:', error)
        throw error
      }
    },
    async fetchRunnerById({ commit }, id) {
      try {
        const response = await api.get(`/runners/${id}`)
        commit('setSelectedRunner', response.data)
      } catch (error) {
        console.error('Error fetching runner:', error)
        throw error
      }
    },
    async fetchRunnerResults({ commit }, id) {
      try {
        const response = await api.get(`/results?runnerId=${id}`)
        commit('setRunnerResults', response.data)
      } catch (error) {
        console.error('Error fetching runner results:', error)
        throw error
      }
    },
    async fetchRaceById({ commit }, id) {
      try {
        const response = await api.get(`/races/${id}`)
        commit('setSelectedRace', response.data)
      } catch (error) {
        console.error('Error fetching race:', error)
        throw error
      }
    },
    async fetchRaceResults({ commit }, id) {
      try {
        const response = await api.get(`/races/${id}/results`)
        commit('setRaceResults', response.data)
      } catch (error) {
        console.error('Error fetching race results:', error)
        throw error
      }
    }
  },
  getters: {
    getRunners: state => state.runners,
    getResults: state => state.results,
    getSeasons: state => state.seasons,
    getRaces: state => state.races,
    getSelectedRunner: state => state.selectedRunner,
    getRunnerResults: state => state.runnerResults,
    getSelectedRace: state => state.selectedRace,
    getRaceResults: state => state.raceResults
  },
  modules: {
    auth
  }
})

export default store 