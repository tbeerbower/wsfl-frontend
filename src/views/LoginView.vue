<template>
  <div class="login-view">
    <h1>Welcome to Fantasy Running League</h1>
    <button @click="handleGoogleLogin" class="google-login-btn">
      <img src="@/assets/google-icon.png" alt="Google" class="google-icon">
      Sign in with Google
    </button>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',
  setup() {
    const store = useStore()
    const router = useRouter()

    const handleGoogleLogin = async () => {
      try {
        console.log('Initiating Google login...')
        const google = window.google
        const client = google.accounts.oauth2.initCodeClient({
          client_id: '32904200865-06fav6dc33cs4judtp1abrt10373ldsj.apps.googleusercontent.com',
          scope: 'email profile',
          callback: async (response) => {
            console.log('Google response received:', response)
            if (response.code) {
              try {
                await store.dispatch('auth/loginWithGoogle', response)
                console.log('Login successful, redirecting...')
                router.push('/')
              } catch (error) {
                console.error('Store dispatch failed:', error)
              }
            } else {
              console.warn('No authorization code in response:', response)
            }
          },
        })
        client.requestCode()
      } catch (error) {
        console.error('Login failed:', error)
      }
    }

    return {
      handleGoogleLogin
    }
  }
}
</script>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.google-login-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 16px;
}

.google-login-btn:hover {
  background: #f5f5f5;
}

.google-icon {
  width: 20px;
  height: 20px;
}
</style> 