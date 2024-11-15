<template>
  <div class="runner-detail">
    <h1>{{ runner?.name || 'Loading...' }}</h1>
    <div class="runner-info">
      <p><strong>Gender:</strong> {{ runner?.gender || 'N/A' }}</p>
      <p><strong>Total Races:</strong> {{ resultStats.count }}</p>
      <p><strong>Average Gender Place:</strong> {{ resultStats.avgGenderPlace }}</p>
      <p><strong>Average Overall Place:</strong> {{ resultStats.avgOverallPlace }}</p>
    </div>
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <div v-else>
      <h2>Race Results</h2>
      <result-table 
        :results="runnerResults"
        :sort-key="sortKey"
        :sort-order="sortOrder"
        :show-runner-name="false"
        @sort="handleSort"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import ResultTable from '../components/ResultTable.vue'

export default {
  name: 'RunnerDetail',
  components: {
    ResultTable
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const sortKey = ref('seasonName')
    const sortOrder = ref('asc')

    onMounted(async () => {
      const runnerId = route.params.id
      await Promise.all([
        store.dispatch('fetchRunnerById', runnerId),
        store.dispatch('fetchRunnerResults', runnerId)
      ])
    })

    const runner = computed(() => store.getters.getSelectedRunner)
    const runnerResults = computed(() => store.getters.getRunnerResults)

    const sortedResults = computed(() => {
      let results = [...runnerResults.value]
      
      // Apply sorting
      results = results.sort((a, b) => {
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

    const resultStats = computed(() => {
      const results = runnerResults.value
      if (!results || results.length === 0) {
        return {
          count: 0,
          avgGenderPlace: 'N/A',
          avgOverallPlace: 'N/A'
        }
      }

      const genderPlaces = results
        .map(r => parseInt(r.placeGender))
        .filter(p => !isNaN(p))
      const overallPlaces = results
        .map(r => parseInt(r.placeOverall))
        .filter(p => !isNaN(p))

      return {
        count: results.length,
        avgGenderPlace: genderPlaces.length > 0 
          ? (genderPlaces.reduce((a, b) => a + b, 0) / genderPlaces.length).toFixed(1)
          : 'N/A',
        avgOverallPlace: overallPlaces.length > 0
          ? (overallPlaces.reduce((a, b) => a + b, 0) / overallPlaces.length).toFixed(1)
          : 'N/A'
      }
    })

    return {
      runner,
      runnerResults: sortedResults,
      sortKey,
      sortOrder,
      error: computed(() => store.getters.getError),
      handleSort,
      resultStats
    }
  }
}
</script>

<style scoped>
.runner-detail {
  padding: 20px;
}

.runner-info {
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.error {
  color: red;
  padding: 20px;
  text-align: center;
}
</style> 