<template>
  <div class="result-list">
    <h1>
      Results - {{ selectedSeasonName }} - 
      <router-link 
        :to="{ name: 'RaceDetail', params: { id: selectedRaceId }}"
        class="race-link"
      >{{ selectedRaceName }}</router-link>
    </h1>
    <div class="filters">
      <input 
        v-model="filters.runnerSearch" 
        placeholder="Search runners..." 
        class="filter-input"
      >
      <select v-model="filters.seasonId" class="filter-input" @change="handleSeasonChange">
        <option v-for="season in seasons" :key="season.id" :value="season.id">
          {{ season.name }}
        </option>
      </select>
      <select v-model="filters.raceId" class="filter-input">
        <option v-for="race in filteredRaces" :key="race.id" :value="race.id">
          {{ race.name }}
        </option>
      </select>
    </div>
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <div v-else-if="loading" class="loading">
      Loading...
    </div>
    <div v-else>
      <result-table 
        :results="filteredResults"
        :sort-key="sortKey"
        :sort-order="sortOrder"
        :show-race-name="false"
        :show-season-name="false"
        @sort="handleSort"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import ResultTable from '../components/ResultTable.vue'

export default {
  name: 'ResultList',
  components: {
    ResultTable
  },
  setup() {
    const store = useStore()
    const sortKey = ref('placeOverall')
    const sortOrder = ref('asc')
    const filters = ref({
      runnerSearch: '',
      seasonId: '',
      raceId: ''
    })

    // Fetch data and set initial filters
    onMounted(async () => {
      await Promise.all([
        store.dispatch('fetchResults'),
        store.dispatch('fetchSeasons'),
        store.dispatch('fetchRaces'),
        store.dispatch('fetchRunners')
      ])

      const results = store.getters.getResults
      if (results.length > 0) {
        const firstResult = results[0]
        filters.value.seasonId = firstResult.race.seasonId
        filters.value.raceId = firstResult.raceId
      }
    })

    const filteredRaces = computed(() => {
      const races = store.getters.getRaces || []
      return races.filter(race => race.seasonId === filters.value.seasonId)
    })

    // Watch for season changes to update race selection
    watch(() => filters.value.seasonId, () => {
      const availableRaces = filteredRaces.value
      if (availableRaces.length > 0 && !availableRaces.find(r => r.id === filters.value.raceId)) {
        filters.value.raceId = availableRaces[0].id
      }
    })

    const selectedSeasonName = computed(() => {
      const seasons = store.getters.getSeasons || []
      const season = seasons.find(s => s.id === filters.value.seasonId)
      return season ? season.name : ''
    })

    const selectedRaceName = computed(() => {
      const races = store.getters.getRaces || []
      const race = races.find(r => r.id === filters.value.raceId)
      return race ? race.name : ''
    })
    
    const selectedRaceId = computed(() => {
      const races = store.getters.getRaces || []
      const race = races.find(r => r.id === filters.value.raceId)
      return race ? race.id : 0
    })

    const filteredResults = computed(() => {
      let results = store.getters.getResults || []

      // Filter by season and race
      results = results.filter(result => 
        result.race.seasonId === filters.value.seasonId &&
        result.raceId === filters.value.raceId
      )

      // Apply runner search filter
      if (filters.value.runnerSearch) {
        const search = filters.value.runnerSearch.toLowerCase()
        results = results.filter(result => {
          const runnerName = result.runner?.name || ''
          return runnerName.toLowerCase().includes(search)
        })
      }

      // Apply sorting
      results = [...results].sort((a, b) => {
        let aValue, bValue

        switch (sortKey.value) {
          case 'runnerName':
            aValue = a.runner?.name || ''
            bValue = b.runner?.name || ''
            break
          case 'raceName':
            aValue = a.race?.name || ''
            bValue = b.race?.name || ''
            break
          case 'seasonName':
            aValue = a.race?.season?.name || ''
            bValue = b.race?.season?.name || ''
            break
          case 'placeGender':
          case 'placeOverall':
            aValue = parseInt(a[sortKey.value]) || Number.MAX_VALUE
            bValue = parseInt(b[sortKey.value]) || Number.MAX_VALUE
            break
          default:
            aValue = a[sortKey.value] || ''
            bValue = b[sortKey.value] || ''
        }

        if (sortOrder.value === 'asc') {
          return aValue > bValue ? 1 : -1
        }
        return aValue < bValue ? 1 : -1
      })

      return results
    })

    const handleSort = (key) => {
      if (key === sortKey.value) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey.value = key
        sortOrder.value = 'asc'
      }
    }

    return {
      filters,
      sortKey,
      sortOrder,
      filteredResults,
      filteredRaces,
      selectedSeasonName,
      selectedRaceName,
      selectedRaceId,
      seasons: computed(() => store.getters.getSeasons || []),
      error: computed(() => store.getters.getError),
      loading: computed(() => store.getters.isLoading),
      handleSort
    }
  }
}
</script>

<style scoped>
.result-list {
  padding: 20px;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.filter-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error {
  color: red;
  padding: 20px;
  text-align: center;
}

.loading {
  text-align: center;
  padding: 20px;
}

.race-link {
  color: inherit;
  text-decoration: none;
}

.race-link:hover {
  color: #42b983;
}
</style> 