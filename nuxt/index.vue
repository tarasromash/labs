<script setup lang="ts">
import { ref, computed } from 'vue'

// Встановлюємо заголовок сторінки (вимога лабораторної)
useHead({ title: 'Список продуктів' })

// --- ЗАВАНТАЖЕННЯ ДАНИХ ---
// 1. Дані для тарифів з нашого локального API
const { data: pricingPlans } = await useFetch('/api/pricing')

// 2. Дані для таблиці з DummyJSON (завантажуємо 100 записів для правильного глобального сортування)
const { data: apiData, pending } = await useFetch('https://dummyjson.com/products?limit=100')
const products = computed(() => apiData.value?.products || [])

// --- НАЛАШТУВАННЯ ТАБЛИЦІ ---
const search = ref('')
const page = ref(1)
const pageCount = ref(5) // Кількість рядків на одній сторінці
const sort = ref({ column: 'title', direction: 'asc' })

const columns = [
  { key: 'thumbnail', label: 'Фото' },
  { key: 'title', label: 'Назва', sortable: true },
  { key: 'description', label: 'Опис' },
  { key: 'price', label: 'Ціна', sortable: true },
  { key: 'rating', label: 'Оцінка', sortable: true },
  { key: 'brand', label: 'Бренд', sortable: true },
  { key: 'category', label: 'Категорія', sortable: true }
]

// Глобальне фільтрування та сортування (ДО пагінації)
const filteredAndSortedRows = computed(() => {
  let data = [...products.value]

  if (search.value) {
    const q = search.value.toLowerCase()
    data = data.filter(product =>
        Object.values(product).some(val => String(val).toLowerCase().includes(q))
    )
  }

  if (sort.value.column) {
    data.sort((a, b) => {
      const valA = a[sort.value.column]
      const valB = b[sort.value.column]
      if (valA === valB) return 0
      const comparison = valA > valB ? 1 : -1
      return sort.value.direction === 'desc' ? -comparison : comparison
    })
  }
  return data
})

// Пагінація вже відфільтрованого списку
const paginatedRows = computed(() => {
  const start = (page.value - 1) * pageCount.value
  const end = start + pageCount.value
  return filteredAndSortedRows.value.slice(start, end)
})
</script>

<template>
  <UContainer class="py-10">

    <!-- БЛОК 1: ТАРИФИ -->
    <h2 class="text-3xl font-bold text-center mb-8">Start Your 3 Day Free Trial</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      <UCard v-for="plan in pricingPlans" :key="plan.title" class="flex flex-col border-t-4 border-t-blue-500 shadow-lg">
        <div class="text-center mb-4">
          <h3 class="text-xl font-bold mb-2">{{ plan.title }}</h3>
          <p class="text-xs text-gray-500 mb-1">3-days free then:</p>
          <div class="text-4xl font-extrabold">${{ plan.price }}<span class="text-sm font-normal text-gray-500">/month</span></div>
          <p class="text-xs text-gray-400 mt-1">billed yearly at ${{ plan.oldPrice }}</p>
          <UBadge color="green" variant="subtle" class="mt-3 font-bold px-3 py-1">
            ${{ plan.savings }} in savings
          </UBadge>
        </div>
        <UButton color="orange" block size="lg" class="mb-6 font-bold text-white">Try It Free</UButton>
        <ul class="space-y-3 text-sm text-gray-600">
          <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-2">
            <UIcon name="i-heroicons-plus-small" class="text-green-500 w-5 h-5 flex-shrink-0" />
            <span>{{ feature }}</span>
          </li>
        </ul>
      </UCard>
    </div>

    <UDivider class="mb-12" />

    <!-- БЛОК 2: ТАБЛИЦЯ -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h2 class="text-2xl font-bold">Список продуктів (Лабораторна 5)</h2>
      <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Пошук по всій таблиці..." class="w-full md:w-72" />
    </div>

    <UCard class="shadow-lg">
      <UTable
          :rows="paginatedRows"
          :columns="columns"
          :loading="pending"
          v-model:sort="sort"
          sort-mode="manual"
      >
        <!-- Форматування колонки Фото (100x100) -->
        <template #thumbnail-data="{ row }">
          <img :src="row.thumbnail" :alt="row.title" class="w-[100px] h-[100px] object-cover rounded-md border shadow-sm" />
        </template>

        <!-- Форматування колонки Оцінка (зелений/червоний) -->
        <template #rating-data="{ row }">
          <span :class="row.rating < 4.5 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'">
            {{ row.rating }}
          </span>
        </template>

        <!-- Форматування колонки Ціна -->
        <template #price-data="{ row }">
          ${{ row.price }}
        </template>
      </UTable>

      <template #footer>
        <div class="flex justify-end pt-4 border-t border-gray-100">
          <UPagination
              v-model="page"
              :page-count="pageCount"
              :total="filteredAndSortedRows.length"
          />
        </div>
      </template>
    </UCard>

  </UContainer>
</template>