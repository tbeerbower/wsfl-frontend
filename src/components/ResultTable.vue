<template>
  <table class="result-table">
    <thead>
      <tr>
        <th v-if="showRunnerName" @click="$emit('sort', 'runnerName')">
          Runner Name
          <sort-indicator :active="sortKey === 'runnerName'" :order="sortOrder" />
        </th>
        <th @click="$emit('sort', 'placeGender')">
          Gender Place
          <sort-indicator :active="sortKey === 'placeGender'" :order="sortOrder" />
        </th>
        <th @click="$emit('sort', 'placeOverall')">
          Overall Place
          <sort-indicator :active="sortKey === 'placeOverall'" :order="sortOrder" />
        </th>
        <th @click="$emit('sort', 'time')">
          Time
          <sort-indicator :active="sortKey === 'time'" :order="sortOrder" />
        </th>
        <th v-if="showRaceName" @click="$emit('sort', 'raceName')">
          Race
          <sort-indicator :active="sortKey === 'raceName'" :order="sortOrder" />
        </th>
        <th v-if="showSeasonName" @click="$emit('sort', 'seasonName')">
          Season
          <sort-indicator :active="sortKey === 'seasonName'" :order="sortOrder" />
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(result, index) in results" :key="result.id">
        <tr :class="getRowClass(result, index)">
          <td v-if="showRunnerName">
            <router-link 
              :to="{ name: 'RunnerDetail', params: { id: result.runner?.id }}"
              v-if="result.runner?.id"
            >
              {{ result.runner?.name || 'N/A' }}
            </router-link>
            <span v-else>{{ result.runner?.name || 'N/A' }}</span>
          </td>
          <td>{{ result.placeGender || 'N/A' }}</td>
          <td>{{ result.placeOverall || 'N/A' }}</td>
          <td>{{ result.time || 'N/A' }}</td>
          <td v-if="showRaceName">
            <router-link :to="{ name: 'RaceDetail', params: { id: result.raceId }}">
              {{ result.race?.name || 'N/A' }}
            </router-link>
          </td>
          <td v-if="showSeasonName">{{ result.race?.season?.name || 'N/A' }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
import SortIndicator from './SortIndicator.vue'

export default {
  name: 'ResultTable',
  components: {
    SortIndicator
  },
  props: {
    results: {
      type: Array,
      required: true
    },
    sortKey: {
      type: String,
      required: true
    },
    sortOrder: {
      type: String,
      required: true
    },
    showRunnerName: {
      type: Boolean,
      default: true
    },
    showRaceName: {
      type: Boolean,
      default: true
    },
    showSeasonName: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    getRowClass(result, index) {
      if (index === 0) return 'season-start'
      const prevResult = this.results[index - 1]
      const currentSeasonId = result.race?.season?.id
      const prevSeasonId = prevResult.race?.season?.id
      
      if (currentSeasonId !== prevSeasonId) {
        return 'season-start'
      }
      
      return prevResult.race?.season?.id % 2 === 0 ? 'season-even' : 'season-odd'
    }
  }
}
</script>

<style scoped>
.result-table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  cursor: pointer;
}

th:hover {
  background-color: #e5e5e5;
}

tr:hover {
  background-color: #f9f9f9 !important;
}

.season-start {
  border-top: 2px solid #42b983;
}

.season-even {
  background-color: #f8f8f8;
}

.season-odd {
  background-color: #ffffff;
}
</style> 