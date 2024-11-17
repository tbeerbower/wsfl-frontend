<template>
  <header class="app-header">
    <nav>
      <router-link to="/" class="brand">Fantasy Running League</router-link>
      <div class="nav-links">
        <router-link to="/runners">Runners</router-link>
        <router-link to="/results">Results</router-link>
      </div>
      <div class="user-info" v-if="currentUser">
        <img :src="currentUser.picture" :alt="currentUser.name" class="user-avatar">
        <span class="user-name">{{ currentUser.name }}</span>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>
    </nav>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'AppHeader',
  setup() {
    const store = useStore()
    const router = useRouter()

    const handleLogout = () => {
      store.dispatch('auth/logout')
      router.push('/login')
    }

    return {
      currentUser: computed(() => store.getters['auth/currentUser']),
      handleLogout
    }
  }
}
</script> 