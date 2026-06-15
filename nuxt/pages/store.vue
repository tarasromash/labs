<script setup>
const userStore = useUserStore()

const { name, isLoggedIn, welcomeMessage } = storeToRefs(userStore)

const inputName = ref('')

const handleLogin = () => {
  if (inputName.value) {
    userStore.login(inputName.value)
    inputName.value = ''
  }
}
</script>

<template>
  <div style="padding: 40px; font-family: Arial">
    <h1>{{ welcomeMessage }}</h1>

    <div v-if="!isLoggedIn">
      <input v-model="inputName" placeholder="Введіть ваше ім'я" />
      <button @click="handleLogin">Увійти</button>
    </div>

    <div v-else>
      <p>Ви зайшли як: {{ name }}</p>
      <p>Час входу: {{ userStore.loginTime }}</p>

      <button @click="userStore.logout">Вийти</button>
    </div>
  </div>
</template>