<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">
        Категорії
      </h1>

      <NuxtLink to="/admin/blog/categories/create">
        <UButton>
          Додати категорію
        </UButton>
      </NuxtLink>
    </div>

    <UTable :data="categories" :columns="columns">
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
        @update:page="getCategories"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const categories = ref([])
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
    id: 'title',
    accessorKey: 'title',
    header: 'Назва',
  },
  {
    id: 'slug',
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    id: 'parent_title',
    accessorKey: 'parent_title',
    header: 'Батьківська категорія',
  },
  {
    id: 'actions',
    header: 'Дії',
  },
]

const getCategories = async () => {
  const response: any = await $fetch(`http://localhost/api/admin/blog/categories?page=${page.value}`)

  categories.value = response.data
  total.value = response.meta?.total ?? response.total ?? 0
  perPage.value = response.meta?.per_page ?? response.per_page ?? 25
}

const getActions = (category: any) => [
  [
    {
      label: 'Редагувати',
      icon: 'i-lucide-pencil',
      to: `/admin/blog/categories/${category.id}/edit`,
    },
    {
      label: 'Видалити',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect: async () => {
        if (!confirm(`Видалити категорію "${category.title}"?`)) {
          return
        }

        await $fetch(`http://localhost/api/admin/blog/categories/${category.id}`, {
          method: 'DELETE',
        })

        await getCategories()
      },
    },
  ],
]

getCategories()
</script>
