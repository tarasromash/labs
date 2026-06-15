<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">
      Список статей через Nuxt UI
    </h1>

    <UTable :data="posts" :columns="columns" />

    <div class="flex justify-center mt-4">
      <UPagination
        v-model:page="page"
        :total="total"
        :items-per-page="perPage"
        @update:page="getPosts"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const posts = ref([])
const page = ref(1)
const perPage = ref(25)
const total = ref(0)

const columns = [
  {
    id: 'id',
    accessorKey: 'id',
    header: '#',
  },
  {
    id: 'author',
    accessorKey: 'author',
    header: 'Автор',
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: 'Категорія',
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: 'Заголовок',
  },
  {
    id: 'published_at',
    accessorKey: 'published_at',
    header: 'Дата публікації',
  },
]

const getPosts = async () => {
  const response: any = await $fetch(`http://localhost/api/admin/blog/posts?page=${page.value}`)

  posts.value = response.data.map((post: any) => ({
    id: post.id,
    author: post.user?.name ?? 'Невідомий автор',
    category: post.category?.title ?? 'Без категорії',
    title: post.title,
    published_at: post.published_at,
  }))

  total.value = response.total
  perPage.value = response.per_page
}

getPosts()
</script>
