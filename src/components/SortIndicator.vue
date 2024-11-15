<template>
  <span class="sort-indicator" v-if="active">
    {{ order === 'asc' ? '▲' : '▼' }}
  </span>
</template>

<script>
export default {
  name: 'SortIndicator',
  props: {
    active: {
      type: Boolean,
      required: true
    },
    order: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.sort-indicator {
  margin-left: 4px;
  font-size: 0.8em;
}
</style> 