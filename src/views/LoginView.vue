<template>
    <div class="login-container">
      <div class="login-card">
        <h1>NPS App</h1>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>E-mail</label>
            <input type="email" v-model="credentials.email" required>
          </div>
          <div class="form-group">
            <label>Senha</label>
            <input type="password" v-model="credentials.password" required>
          </div>
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
</template>

  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'

  const router = useRouter()
  const credentials = ref({
    email: '',
    password: ''
  })

  const handleLogin = async () => {
  try {
    const { data } = await axios.get('http://localhost:5012/users')
    const user = data.find(u => u.email === credentials.value.email && u.password === credentials.value.password)

    if(user) {
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}
  </script>

<style scoped lang="scss">
  .login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Garante altura total */
  width: 100%; /* Ocupa largura total */
  padding: 20px; /* Espaço nas bordas em mobile */

    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;

      h1 {
        text-align: center;
        margin-bottom: 2rem;
        color: #202124;
      }

      .form-group {
        margin-bottom: 1.5rem;

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #5f6368;
        }

        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #dadce0;
          border-radius: 4px;
          font-size: 16px;

          &:focus {
            border-color: #1a73e8;
            outline: none;
          }
        }
      }

      button {
        width: 100%;
        padding: 12px;
        background: #1a73e8;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background 0.3s;

        &:hover {
          background: #1557b0;
        }
      }
    }
  }
</style>
