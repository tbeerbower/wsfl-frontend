<template>
    <div>
    <!-- Add filter controls above table -->
    <div class="filter-controls">
      <select @change="$emit('filter-gender', $event.target.value)">
        <option value="">All Genders</option>
        <option value="M">Male</option>
        <option value="F">Female</option>
        <option value="O">Other</option>
      </select>
    </div>
    <table class="runner-table">
      <thead>
        <tr>
          <th @click="$emit('sort', 'name')">
            Name
            <sort-indicator :active="sortKey === 'name'" :order="sortOrder" />
          </th>
          <th @click="$emit('sort', 'gender')">
            Gender
            <sort-indicator :active="sortKey === 'gender'" :order="sortOrder" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="runner in runners" :key="runner.id">
          <td>
            <router-link :to="{ name: 'RunnerDetail', params: { id: runner.id }}">
              {{ runner.name }}
            </router-link>
          </td>
          <td>{{ runner.gender }}</td>
        </tr>
      </tbody>
    </table>
    </div>
  </template>

<script>
import SortIndicator from './SortIndicator.vue'

export default {
  name: 'RunnerTable',
  components: {
    SortIndicator
  },
  props: {
    runners: {
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
    }
  }
}
</script>

<style scoped>
.runner-table {
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
  background-color: #f9f9f9;
}

.filter-controls {
  margin-bottom: 1rem;
}

select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

a {
  color: #2c3e50;
  text-decoration: none;
}

a:hover {
  color: #42b983;
}
</style> 