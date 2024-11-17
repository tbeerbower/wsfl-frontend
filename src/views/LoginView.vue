<template>
  <div class="login-view">
    <img src="@/assets/wsfl-logo.webp" alt="WSFL Logo" class="wsfl-logo">
    <h1>Welcome to the WSFL</h1>
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
  background-color: #2d3436;
  color: #dfe6e9;
}

h1 {
  color: #dfe6e9;
  font-weight: 600;
  font-size: 1.8rem;
  margin-bottom: 2rem;
}

.google-login-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  background: #636e72;
  color: #dfe6e9;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
}

.google-login-btn:hover {
  background-color: #74b9ff;
}

.google-icon {
  width: 20px;
  height: 20px;
}

.wsfl-logo {
  width: 200px;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 8px rgba(116, 185, 255, 0.3));
}

@media (max-width: 768px) {
  h1 {
    font-size: 1.4rem;
    text-align: center;
  }
  
  .wsfl-logo {
    width: 150px;
  }
}
</style> 