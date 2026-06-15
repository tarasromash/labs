<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">
        Статті блогу
      </h1>

      <NuxtLink to="/admin/blog/posts/create">
        <UButton>
          Додати статтю
        </UButton>
      </NuxtLink>
    </div>

    <UTable :data="posts" :columns="columns">
      <template #actions-cell="{ row }">
        <UDropdownMenu :items="getActions(row.original)">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </template>
    </UTable>

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
    id: 'date_published',
    accessorKey: 'date_published',
    header: 'Дата публікації',
  },
  {
    id: 'actions',
    header: 'Дії',
  },
]

const getPosts = async () => {
  const response: any = await $fetch(`http://localhost/api/admin/blog/posts?page=${page.value}`)

  posts.value = response.data.map((post: any) => ({
    id: post.id,
    title: post.title,
    author: post.author_name ?? post.user?.name ?? 'Невідомий автор',
    category: post.category_title ?? post.category?.title ?? 'Без категорії',
    date_published: post.date_published ?? post.published_at,
  }))

  total.value = response.meta?.total ?? response.total ?? 0
  perPage.value = response.meta?.per_page ?? response.per_page ?? 25
}

const getActions = (post: any) => [
  [
    {
      label: 'Переглянути',
      icon: 'i-lucide-eye',
      to: `/blog-posts/${post.id}`,
    },
    {
      label: 'Редагувати',
      icon: 'i-lucide-pencil',
      to: `/admin/blog/posts/${post.id}/edit`,
    },
    {
      label: 'Видалити',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect: async () => {
        if (!confirm(`Видалити статтю "${post.title}"?`)) {
          return
        }

        await $fetch(`http://localhost/api/admin/blog/posts/${post.id}`, {
          method: 'DELETE',
        })

        await getPosts()
      },
    },
  ],
]

getPosts()
</script>
