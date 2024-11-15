<template>
  <div class="race-detail">
    <h1>{{ race?.name || 'Loading...' }}</h1>
    <div class="race-info">
      <p><strong>Season:</strong> {{ race?.season?.name || 'N/A' }}</p>
      <p><strong>Week:</strong> {{ race?.week || 'N/A' }}</p>
    </div>
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <div v-else-if="loading" class="loading">
      Loading...
    </div>
    <div v-else>
      <h2>Results</h2>
      <result-table 
        :results="sortedResults"
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
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import ResultTable from '../components/ResultTable.vue'

export default {
  name: 'RaceDetail',
  components: {
    ResultTable
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const sortKey = ref('placeOverall')
    const sortOrder = ref('asc')

    onMounted(async () => {
      const raceId = route.params.id
      await Promise.all([
        store.dispatch('fetchRaceById', raceId),
        store.dispatch('fetchRaceResults', raceId)
      ])
    })

    const race = computed(() => store.getters.getSelectedRace)
    const results = computed(() => store.getters.getRaceResults)

    const sortedResults = computed(() => {
      let sortedResults = [...results.value]
      
      sortedResults.sort((a, b) => {
        let aValue, bValue

        switch (sortKey.value) {
          case 'runnerName':
            aValue = a.runner?.name || ''
            bValue = b.runner?.name || ''
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

      return sortedResults
    })

    const handleSort = (key) => {
      if (key === sortKey.value) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey.value = key
        sortOrder.value = 'asc'
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString()
    }

    return {
      race,
      sortedResults,
      sortKey,
      sortOrder,
      error: computed(() => store.getters.getError),
      loading: computed(() => store.getters.isLoading),
      handleSort,
      formatDate
    }
  }
}
</script>

<style scoped>
.race-detail {
  padding: 20px;
}

.race-info {
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

.loading {
  text-align: center;
  padding: 20px;
}
</style> 