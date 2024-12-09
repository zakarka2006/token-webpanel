<template>
  <v-container class="d-flex align-center justify-center fill-height w-100 h-100">
    <v-card class="pa-5 w-50">
      <v-card-title class="justify-center">
        Вход
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-text-field
            v-model="username"
            label="Имя пользователя"
            :rules="[v => !!v || 'Обязательное поле']"
            required
          />
          <v-text-field
            v-model="password"
            label="Пароль"
            :rules="[v => !!v || 'Обязательное поле']"
            type="password"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="!valid"
          @click="login"
        >
          Войти
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const password = ref('')
const valid = ref(false)
const form = ref(null)
const router = useRouter()

const login = async () => {
  try {
    const response = await axios.post(import.meta.env.VITE_API_URL + '/login', { username: username.value, password: password.value })
    const token = response.data.token

    // Сохраняем токен в localStorage
    localStorage.setItem('token', token)

    // Перенаправляем на защищённую страницу
    router.push('/')
  } catch (error) {
    alert('Ошибка авторизации: ' + (error.response?.data?.error || error.message))
  }
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
