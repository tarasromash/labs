<template>
  <div class="p-6">
    <NuxtLink to="/blog-posts">
      ← Назад до списку
    </NuxtLink>

    <div v-if="loading">
      Завантаження...
    </div>

    <div v-else-if="error">
      Помилка завантаження поста
    </div>

    <article v-else-if="post" class="mt-4">
      <h1 class="text-3xl font-bold mb-4">
        {{ post.title }}
      </h1>

      <div class="mb-4">
        <p>
          <strong>Автор:</strong>
          {{ post.user?.name ?? 'Невідомий автор' }}
        </p>

        <p>
          <strong>Категорія:</strong>
          {{ post.category?.title ?? 'Без категорії' }}
        </p>

        <p>
          <strong>Дата публікації:</strong>
          {{ post.published_at }}
        </p>
      </div>

      <p v-if="post.excerpt" class="mb-4">
        <strong>Короткий опис:</strong>
        {{ post.excerpt }}
      </p>

      <div v-if="post.content_html" v-html="post.content_html"></div>

      <div v-else>
        <p>{{ post.content_raw }}</p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const post = ref<any>(null)
const loading = ref(false)
const error = ref(false)

const getPost = async () => {
  loading.value = true
  error.value = false

  try {
    const response: any = await $fetch(`http://localhost/api/admin/blog/posts/${route.params.id}`)

    post.value = response.data
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
}

getPost()
</script>
