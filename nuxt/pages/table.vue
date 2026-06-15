<script setup lang="ts">
import { ref, computed, watch } from 'vue'

useHead({ title: 'Таблиця' })

type Product = {
  id: number
  title: string
  price: number
  rating: number
  thumbnail: string
  description?: string
  brand?: string
  category?: string
}

type ProductsResponse = {
  products: Product[]
  total: number
  skip: number
  limit: number
}

const { data, pending, error } = await useFetch<ProductsResponse>('/api/products')

const products = computed<Product[]>(() => {
  return data.value?.products ?? []
})

const search = ref('')
const page = ref(1)
const pageSize = ref(5)

const normalizedSearch = computed(() => {
  return search.value.toLowerCase().trim()
})

const filtered = computed<Product[]>(() => {
  if (!normalizedSearch.value) {
    return products.value
  }

  return products.value.filter((product) => {
    const fields = [
      product.title,
      product.description,
      product.brand,
      product.category,
    ]

    return fields.some((field) =>
        String(field ?? '').toLowerCase().includes(normalizedSearch.value)
    )
  })
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filtered.value.length / pageSize.value))
})

const paginated = computed<Product[]>(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

watch(search, () => {
  page.value = 1
})

watch(pageSize, () => {
  page.value = 1
})
</script>

<template>
  <div class="page">
    <h1>Таблиця продуктів</h1>

    <input
        v-model="search"
        class="search-input"
        placeholder="Пошук..."
    />

    <p>Кількість товарів: {{ filtered.length }}</p>

    <div v-if="pending" class="message">
      Завантаження товарів...
    </div>

    <div v-else-if="error" class="message error">
      Помилка завантаження товарів
    </div>

    <template v-else>
      <table class="products-table">
        <thead>
        <tr>
          <th>Фото</th>
          <th>Назва</th>
          <th>Ціна</th>
          <th>Рейтинг</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="item in paginated" :key="item.id">
          <td>
            <img
                :src="item.thumbnail"
                :alt="item.title"
                width="100"
                height="100"
            />
          </td>

          <td>{{ item.title }}</td>

          <td>${{ item.price }}</td>

          <td :class="item.rating < 4.5 ? 'rating-low' : 'rating-high'">
            {{ item.rating }}
          </td>
        </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button
            @click="page--"
            :disabled="page === 1"
        >
          Prev
        </button>

        <span>{{ page }} / {{ totalPages }}</span>

        <button
            @click="page++"
            :disabled="page === totalPages"
        >
          Next
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page {
  padding: 40px;
  font-family: Arial, sans-serif;
}

.search-input {
  margin-bottom: 20px;
  padding: 8px;
  width: 260px;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th,
.products-table td {
  border: 1px solid #333;
  padding: 10px;
  text-align: left;
}

.products-table img {
  object-fit: cover;
}

.rating-low {
  color: red;
}

.rating-high {
  color: green;
}

.pagination {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.message {
  margin-top: 20px;
  font-weight: bold;
}

.error {
  color: red;
}
</style>