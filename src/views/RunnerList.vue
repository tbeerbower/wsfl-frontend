<template>
  <div class="runner-list">
    <h1>Runners</h1>
    <div class="filters">
      <input 
        v-model="searchQuery" 
        placeholder="Search runners..." 
        class="search-input"
      >
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <div v-else>
      <runner-table 
        :runners="filteredRunners"
        :sort-key="sortKey"
        :sort-order="sortOrder"
        @sort="handleSort"
        @filter-gender="handleGenderFilter"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import RunnerTable from '../components/RunnerTable.vue'

export default {
  name: 'RunnerList',
  components: {
    RunnerTable
  },
  setup() {
    const store = useStore()
    const searchQuery = ref('')
    const sortKey = ref('name')
    const sortOrder = ref('asc')
    const selectedGender = ref('')

    // Fetch runners when component is mounted
    store.dispatch('fetchRunners')

    const filteredRunners = computed(() => {
      let runners = store.getters.getRunners
      
      // Apply search filter
      if (searchQuery.value) {
        runners = runners.filter(runner => 
          runner.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      }

      // Apply gender filter
      if (selectedGender.value) {
        runners = runners.filter(runner => 
          runner.gender === selectedGender.value
        )
      }

      // Apply sorting
      runners = [...runners].sort((a, b) => {
        const aValue = a[sortKey.value]
        const bValue = b[sortKey.value]
        
        if (sortOrder.value === 'asc') {
          return aValue > bValue ? 1 : -1
        }
        return aValue < bValue ? 1 : -1
      })

      return runners
    })

    const handleSort = (key) => {
      if (key === sortKey.value) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey.value = key
        sortOrder.value = 'asc'
      }
    }

    const handleGenderFilter = (gender) => {
      selectedGender.value = gender
    }

    return {
      searchQuery,
      sortKey,
      sortOrder,
      filteredRunners,
      error: computed(() => store.getters.getError),
      handleSort,
      handleGenderFilter
    }
  }
}
</script>

<style scoped>
.runner-list {
  padding: 20px;
}

.filters {
  margin-bottom: 20px;
}

.search-input {
  padding: 8px;
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error {
  color: red;
  padding: 20px;
  text-align: center;
}
</style> 