import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
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
    setLoading(state, loading) {
      state.loading = loading
    },
    setError(state, error) {
      state.error = error
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
      commit('setLoading', true)
      try {
        const response = await axios.get('http://localhost:8080/api/runners')
        commit('setRunners', response.data)
      } catch (error) {
        commit('setError', error.message)
      } finally {
        commit('setLoading', false)
      }
    },
    async fetchResults({ commit }) {
      commit('setLoading', true)
      try {
        const response = await axios.get('http://localhost:8080/api/results')
        commit('setResults', response.data)
      } catch (error) {
        commit('setError', error.message)
      } finally {
        commit('setLoading', false)
      }
    },
    async fetchSeasons({ commit }) {
      try {
        const response = await axios.get('http://localhost:8080/api/seasons')
        commit('setSeasons', response.data)
      } catch (error) {
        commit('setError', error.message)
      }
    },
    async fetchRaces({ commit }) {
      try {
        const response = await axios.get('http://localhost:8080/api/races')
        commit('setRaces', response.data)
      } catch (error) {
        commit('setError', error.message)
      }
    },
    async fetchRunnerById({ commit }, id) {
      try {
        const response = await axios.get(`http://localhost:8080/api/runners/${id}`)
        commit('setSelectedRunner', response.data)
      } catch (error) {
        commit('setError', error.message)
      }
    },
    async fetchRunnerResults({ commit }, id) {
      try {
        const response = await axios.get(`http://localhost:8080/api/results?runnerId=${id}`)
        commit('setRunnerResults', response.data)
      } catch (error) {
        commit('setError', error.message)
      }
    },
    async fetchRaceById({ commit }, id) {
      try {
        const response = await axios.get(`http://localhost:8080/api/races/${id}`)
        commit('setSelectedRace', response.data)
      } catch (error) {
        commit('setError', error.message)
      }
    },
    async fetchRaceResults({ commit }, id) {
      try {
        const response = await axios.get(`http://localhost:8080/api/results?raceId=${id}`)
        commit('setRaceResults', response.data)
      } catch (error) {
        commit('setError', error.message)
      }
    }
  },
  getters: {
    getRunners: state => state.runners,
    isLoading: state => state.loading,
    getError: state => state.error,
    getResults: state => state.results,
    getSeasons: state => state.seasons,
    getRaces: state => state.races,
    getSelectedRunner: state => state.selectedRunner,
    getRunnerResults: state => state.runnerResults,
    getSelectedRace: state => state.selectedRace,
    getRaceResults: state => state.raceResults
  }
}) 