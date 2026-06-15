<template>
  <div class="container">
    <div class="flex justify-center">
      <div class="w-full">
        <nav class="navbar bg-gray-100 p-3 mb-4">
          <a href="/admin/blog/posts/create">Додати</a>
        </nav>

        <div class="card">
          <div class="card-body">
            <table class="table table-auto w-full border">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Автор</th>
                  <th>Категорія</th>
                  <th>Заголовок</th>
                  <th>Дата публікації</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="post in posts" :key="post.id">
                  <td>{{ post.id }}</td>
                  <td>{{ post.user?.name }}</td>
                  <td>{{ post.category?.title }}</td>
                  <td>
                    <a :href="'/admin/blog/posts/' + post.id + '/edit'">
                      {{ post.title }}
                    </a>
                  </td>
                  <td>{{ post.published_at }}</td>
                </tr>
              </tbody>
            </table>

            <div v-if="loading">Завантаження...</div>
            <div v-if="error">Помилка завантаження даних</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const posts = ref([])
const loading = ref(false)
const error = ref(false)

const getPosts = async () => {
  loading.value = true
  error.value = false

  try {
    const response: any = await $fetch('http://localhost/api/admin/blog/posts')
    posts.value = response.data
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
}

getPosts()
</script>
